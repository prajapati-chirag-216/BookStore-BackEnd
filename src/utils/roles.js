const roles = {
  EMPLOYEE: [
    // General permissions
    "LOGOUT_ADMIN_OR_EMPLOYEE",

    // Category permissions
    "FETCH_CATEGORY",
    "FETCH_CATEGORIES",
    "FETCH_CATEGORY_BY_NAME",
    "SEARCH_CATEGORIES",

    // Display permissions
    "FETCH_DISPLAY",

    // Order permissions
    "FETCH_ORDERS",
    "FETCH_ORDER_BY_ID",
    "FETCH_TODAYS_ORDERS",
    "SEARCH_ORDERS",

    // Product permissions
    "FETCH_PRODUCTS",
    "SEARCH_PRODUCTS",

    // Review permissions
    "FETCH_REVIEWS",

    // User permissions
    "FETCH_USERS",
    "SEARCH_USERS",
    "SEARCH_ADMIN_OR_EMPLOYEE",
  ],
  ADMIN: [
    // Admin permissions
    "ADD_ADMIN",
    "UPDATE_ADMIN",
    "DELETE_ADMIN",
    "FETCH_ADMINS",
    "SEARCH_ADMIN_OR_EMPLOYEE",

    // General permissions
    "LOGOUT_ADMIN_OR_EMPLOYEE",

    // Category permissions
    "FETCH_CATEGORY",
    "FETCH_CATEGORIES",
    "FETCH_CATEGORY_BY_NAME",
    "ADD_CATEGORY",
    "DELETE_CATEGORY",
    "UPDATE_CATEGORY_BY_ID",
    "SEARCH_CATEGORIES",

    // Display permissions
    "ADD_DISPLAY",
    "FETCH_DISPLAY",
    "DELETE_DISPLAY",

    // Order permissions
    "FETCH_ORDERS",
    "UPDATE_ORDER_STATUS",
    "FETCH_ORDER_BY_ID",
    "FETCH_TODAYS_ORDERS",
    "DELETE_ORDER",

    // Product permissions
    "FETCH_PRODUCTS",
    "ADD_PRODUCT",
    "DELETE_PRODUCT",
    "UPDATE_PRODUCT",
    "SEARCH_PRODUCTS",

    // Review permissions
    "FETCH_REVIEWS",
    "ADD_REVIEWS",
    "DELETE_REVIEW",

    // User permissions
    "FETCH_USERS",
    "DELETE_USER",
    "SEARCH_USERS",

    "SEARCH_ORDERS",
  ],
};

module.exports = roles;
