erDiagram
    USER ||--o{ CART : "has"
    USER ||--o{ ORDER : "places"

    CATEGORY ||--o{ PRODUCT : "has"
    PRODUCT ||--o{ CART_ITEM : "in"
    PRODUCT ||--o{ ORDER_ITEM : "in"
    PRODUCT ||--o{ INVENTORY_MOVEMENT : "changes"

    CART ||--o{ CART_ITEM : "contains"
    ORDER ||--o{ ORDER_ITEM : "contains"

    USER {
      int id PK
      string email UNIQUE
      string password
      string name
      datetime createdAt
    }

    CATEGORY {
      int id PK
      string name UNIQUE
    }

    PRODUCT {
      int id PK
      string name
      string description NULLABLE
      float price
      int stock
      int categoryId FK
      datetime createdAt
    }

    CART {
      int id PK
      int userId FK
      boolean active
      datetime createdAt
    }

    CART_ITEM {
      int id PK
      int cartId FK
      int productId FK
      int quantity
      float price
    }

    ORDER {
      int id PK
      int userId FK
      string status
      datetime createdAt
    }

    ORDER_ITEM {
      int id PK
      int orderId FK
      int productId FK
      int quantity
      float price
    }

    INVENTORY_MOVEMENT {
      int id PK
      int productId FK
      int change
      string reason
      datetime createdAt
    }

    VOICE_INTENTS_LOG {
      int id PK
      string transcript
      string language
      float confidence
      string activation
      string intent
      string result
      datetime createdAt
    }
