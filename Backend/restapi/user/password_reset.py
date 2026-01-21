"""
Password Reset OTP Management Module
Handles OTP generation, storage, and verification
"""

import random
import string
from datetime import datetime, timedelta
from django.core.cache import cache
from django.contrib.auth.hashers import make_password
import asyncio
6
try:
    from telegram import Bot
except ImportError:
    Bot = None

from django.conf import settings

class OTPManager:
    """Manages OTP generation, storage, and verification"""
    
    OTP_EXPIRY_MINUTES = 5  # OTP valid for 5 minutes
    OTP_LENGTH = 6
    MAX_OTP_ATTEMPTS = 3
    
    @staticmethod
    def generate_otp():
        """Generate a random 6-digit OTP"""
        return ''.join(random.choices(string.digits, k=OTPManager.OTP_LENGTH))
    
    @staticmethod
    def send_otp_via_telegram(user_phone, user_name, otp):
        """
        Send OTP via Telegram to user's phone number stored as Telegram chat ID
        
        Args:
            user_phone: The phone number (used as key for chat_id lookup)
            user_name: User's name for personalized message
            otp: The OTP to send
            
        Returns:
            tuple: (success: bool, message: str)
        """
        try:
            # In production, you'd map phone numbers to Telegram chat IDs
            # For now, we'll store the mapping in cache during phone verification
            chat_id = cache.get(f'telegram_chat_id_{user_phone}')
            
            if not chat_id:
                return False, "Telegram chat ID not found. Please verify phone first."
            
            bot_token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
            if not bot_token:
                return False, "Telegram bot not configured"
            
            # Create message
            message = f"""🔐 Password Reset OTP

Hi {user_name},

Your One-Time Password (OTP) for password reset is:

🔑 {otp}

This OTP will expire in {OTPManager.OTP_EXPIRY_MINUTES} minutes.

⚠️ Do NOT share this OTP with anyone.

If you didn't request this, please ignore this message.
"""
            
            # Send via Telegram Bot API
            bot = Bot(token=bot_token)
            
            # Run async function in sync context
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                loop.run_until_complete(bot.send_message(chat_id=chat_id, text=message))
                return True, "OTP sent successfully"
            finally:
                loop.close()
                
        except Exception as e:
            return False, f"Error sending OTP: {str(e)}"
    
    @staticmethod
    def save_otp(phone_number, otp):
        """Store OTP in cache with expiry"""
        cache_key = f'otp_{phone_number}'
        cache.set(cache_key, otp, timeout=OTPManager.OTP_EXPIRY_MINUTES * 60)
        
        # Also store attempt counter
        attempt_key = f'otp_attempts_{phone_number}'
        cache.set(attempt_key, 0, timeout=OTPManager.OTP_EXPIRY_MINUTES * 60)
    
    @staticmethod
    def verify_otp(phone_number, provided_otp):
        """
        Verify OTP and check attempts
        
        Returns:
            tuple: (is_valid: bool, message: str)
        """
        cache_key = f'otp_{phone_number}'
        attempt_key = f'otp_attempts_{phone_number}'
        
        stored_otp = cache.get(cache_key)
        attempts = cache.get(attempt_key, 0)
        
        # Check if OTP exists and not expired
        if not stored_otp:
            return False, "OTP expired. Please request a new one."
        
        # Check attempts
        if attempts >= OTPManager.MAX_OTP_ATTEMPTS:
            cache.delete(cache_key)
            cache.delete(attempt_key)
            return False, "Maximum OTP attempts exceeded. Please request a new OTP."
        
        # Verify OTP
        if str(provided_otp) == str(stored_otp):
            # Clear OTP after successful verification
            cache.delete(cache_key)
            cache.delete(attempt_key)
            return True, "OTP verified successfully"
        else:
            # Increment attempts
            cache.set(attempt_key, attempts + 1, timeout=OTPManager.OTP_EXPIRY_MINUTES * 60)
            remaining = OTPManager.MAX_OTP_ATTEMPTS - attempts - 1
            return False, f"Invalid OTP. {remaining} attempts remaining."
    
    @staticmethod
    def store_phone_verification(phone_number, telegram_chat_id):
        """Store verified phone number and its Telegram chat ID"""
        cache_key = f'verified_phone_{phone_number}'
        cache.set(cache_key, True, timeout=24 * 60 * 60)  # Valid for 24 hours
        
        # Store mapping for OTP sending
        cache.set(f'telegram_chat_id_{phone_number}', telegram_chat_id, timeout=24 * 60 * 60)
    
    @staticmethod
    def is_phone_verified(phone_number):
        """Check if phone number is verified"""
        return cache.get(f'verified_phone_{phone_number}') is not None
