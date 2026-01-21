# Insurance Platform Database Schema

This document outlines the database schema for an insurance platform. The platform includes seven key tables that interact with each other. Below are the details for each table.

---

### 1. **User Table (Admin Users)**

| Field           | Type       | Description                          |
|-----------------|------------|--------------------------------------|
| **id**          | Primary Key| Auto-incrementing identifier         |
| **name**        | CharField  | Name of the user                     |
| **email**       | EmailField | Email address (unique)               |
| **password**    | CharField  | Hashed password                      |
| **phone_number**| CharField  | Unique phone number                  |
| **role**        | CharField  | Role of the user (`admin`, `super_admin`) |
| **created_at**  | DateTimeField| Timestamp of creation               |

---

### 2. **Customer Table**

| Field           | Type       | Description                          |
|-----------------|------------|--------------------------------------|
| **id**          | Primary Key| Auto-incrementing identifier         |
| **name**        | CharField  | Name of the customer                 |
| **email**       | EmailField | Email address (unique)               |
| **password**    | CharField  | Hashed password                      |
| **phone_number**| CharField  | Unique phone number                  |
| **role**        | CharField  | Role of the customer (`customer`)    |
| **created_at**  | DateTimeField| Timestamp of creation               |

---

### 3. **Plan Table**

| Field             | Type          | Description                              |
|-------------------|---------------|------------------------------------------|
| **id**            | Primary Key   | Auto-incrementing identifier             |
| **user_id**       | ForeignKey    | Link to the user who created the plan   |
| **plan_name**     | CharField     | Name of the insurance plan              |
| **plan_description**| TextField    | Detailed description of the plan        |
| **price**         | DecimalField  | Price of the plan                        |
| **created_at**    | DateTimeField | Timestamp of creation                    |

---

### 4. **Insurance Company Table**

| Field             | Type         | Description                                |
|-------------------|--------------|--------------------------------------------|
| **id**            | Primary Key  | Auto-incrementing identifier               |
| **name**          | CharField    | Name of the insurance company             |
| **address**       | CharField    | Address of the insurance company          |
| **contact_info**  | CharField    | Contact information of the insurance company|
| **website**       | URLField     | Website of the insurance company          |
| **created_at**    | DateTimeField| Timestamp of creation                     |

---

### 5. **Insurance Type Table**

| Field             | Type          | Description                                |
|-------------------|---------------|--------------------------------------------|
| **id**            | Primary Key   | Auto-incrementing identifier               |
| **type_name**     | CharField     | Type of insurance (e.g., `health`, `car`, `life`)|
| **description**   | TextField     | Detailed description of the insurance type |
| **created_at**    | DateTimeField | Timestamp of creation                     |

---

### 6. **Policy Table**

| Field             | Type          | Description                               |
|-------------------|---------------|-------------------------------------------|
| **id**            | Primary Key   | Auto-incrementing identifier              |
| **insurance_type_id** | ForeignKey  | Link to the insurance type               |
| **insurance_company_id** | ForeignKey| Link to the insurance company            |
| **policy_name**   | CharField     | Name of the policy                       |
| **policy_details**| TextField     | Detailed description of the policy       |
| **coverage**      | DecimalField  | Coverage amount                          |
| **premium_amount**| DecimalField  | Premium cost                             |
| **created_at**    | DateTimeField | Timestamp of creation                    |

---

### 7. **Agent Table**

| Field             | Type         | Description                                |
|-------------------|--------------|--------------------------------------------|
| **id**            | Primary Key  | Auto-incrementing identifier               |
| **name**          | CharField    | Name of the agent                         |
| **email**         | EmailField   | Email address (unique)                    |
| **phone_number**  | CharField    | Unique phone number                        |
| **referral_code** | CharField    | Unique referral code                      |
| **commission_percentage** | DecimalField | Agent's commission percentage |
| **created_at**    | DateTimeField| Timestamp of creation                     |

---

### 8. **Customer Policy Table**

| Field             | Type          | Description                               |
|-------------------|---------------|-------------------------------------------|
| **id**            | Primary Key   | Auto-incrementing identifier              |
| **customer_id**   | ForeignKey    | Link to the customer who bought the policy|
| **policy_id**     | ForeignKey    | Link to the purchased policy             |
| **agent_id**      | ForeignKey    | Link to the referring agent              |
| **subscription_date** | DateTimeField | Date when the policy was purchased |
| **expiry_date**   | DateTimeField | Date when the policy expires             |
| **premium_amount_paid** | DecimalField | Amount paid for the policy |
| **status**        | CharField     | Policy status (`active`, `expired`, `cancelled`) |

---

This schema represents the structure of the database for your insurance platform.
