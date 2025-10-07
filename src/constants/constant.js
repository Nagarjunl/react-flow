export const tableSchema = {
    "metrics": [
        { "name": "TargetAchievement", "type": "numeric" },
        { "name": "AttendancePercentage", "type": "numeric" },
        { "name": "StoreKpiAchievement", "type": "numeric" },
        { "name": "PresentDays", "type": "integer" },
        { "name": "AbsentDays", "type": "integer" },
        { "name": "ApprovedLeaveDays", "type": "integer" },
        { "name": "TotalWorkingDays", "type": "integer" },
        { "name": "NumberOfMcUplDays", "type": "integer" },
        { "name": "StoreTargetAchievement", "type": "numeric" }
    ],
    "user": [
        { "name": "Designation", "type": "varchar" },
        { "name": "Name", "type": "varchar" },
        { "name": "Id", "type": "integer" }
    ],
    "sales": [
        { "name": "Amount", "type": "numeric" },
        { "name": "Quantity", "type": "integer" },
        { "name": "Date", "type": "date" }
    ],
    "orders": [
        { "name": "id", "type": "integer" },
        { "name": "customer_id", "type": "integer" },
        { "name": "product_id", "type": "integer" },
        { "name": "quantity", "type": "integer" },
        { "name": "unit_price", "type": "numeric" },
        { "name": "total_price", "type": "numeric" },
        { "name": "discount_rate", "type": "numeric" },
        { "name": "status", "type": "varchar" }
    ],
    "products": [
        { "name": "id", "type": "integer" },
        { "name": "name", "type": "varchar" },
        { "name": "price", "type": "numeric" },
        { "name": "category", "type": "varchar" },
        { "name": "stock_quantity", "type": "integer" }
    ],
    "customers": [
        { "name": "id", "type": "integer" },
        { "name": "name", "type": "varchar" },
        { "name": "email", "type": "varchar" },
        { "name": "discount_rate", "type": "numeric" },
        { "name": "membership_level", "type": "varchar" }
    ]
}