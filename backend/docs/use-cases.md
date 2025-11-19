# MercadoVerde — Casos de Uso (MVP)

Este documento describe los **casos de uso** actual (Users, Categories, Products, Cart, Orders, InventoryMovement, VoiceIntentsLog).

---

## Vista global 


```mermaid
flowchart LR
  %% Actores
  A[Buyer]:::actor
  B[Admin]:::actor
  V[Voice Client]:::actor

  %% Casos
  UC1[UC-01 Login]
  UC2[UC-02 Listar - Buscar productos]
  UC3[UC-03 Ver producto]
  UC4[UC-04 Carrito - agregar - actualizar - eliminar]
  UC5[UC-05 Checkout - crear pedido]
  UC6[UC-06 Ver pedidos]
  UC7[UC-07 CRUD categorias]
  UC8[UC-08 Registrar VoiceIntentsLog]

  %% Relaciones
  A --> UC1
  A --> UC2
  A --> UC3
  A --> UC4
  A --> UC5
  A --> UC6
  B --> UC7
  V --> UC8

  classDef actor fill:#222,stroke:#999,stroke-width:1px,color:#fff;
