# MercadoVerde — Modelo Entidad–Relación (E-R) 

> Diagrama.

## 

```mermaid
erDiagram
    USER ||--o{ CART : has
    USER ||--o{ ORDER : places

    CATEGORY ||--o{ PRODUCT : has
    PRODUCT ||--o{ CART_ITEM : in
    PRODUCT ||--o{ ORDER_ITEM : in
    PRODUCT ||--o{ INVENTORY_MOVEMENT : changes

    CART ||--o{ CART_ITEM : contains
    ORDER ||--o{ ORDER_ITEM : contains

    USER {
      int id
      string email
      string password
      string name
      datetime createdAt
    }

    CATEGORY {
      int id
      string name
    }

    PRODUCT {
      int id
      string name
      string description
      float price
      int stock
      int categoryId
      datetime createdAt
    }

    CART {
      int id
      int userId
      boolean active
      datetime createdAt
    }

    CART_ITEM {
      int id
      int cartId
      int productId
      int quantity
      float price
    }

    ORDER {
      int id
      int userId
      string status
      datetime createdAt
    }

    ORDER_ITEM {
      int id
      int orderId
      int productId
      int quantity
      float price
    }

    INVENTORY_MOVEMENT {
      int id
      int productId
      int change
      string reason
      datetime createdAt
    }

    VOICE_INTENTS_LOG {
      int id
      string transcript
      string language
      float confidence
      string activation
      string intent
      string result
      datetime createdAt
    }
