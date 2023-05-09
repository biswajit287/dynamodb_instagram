module.exports = {
    parserOptions: {
        parser: "@typescript-eslint/parser"
    },
    env: {
        node: true
    },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:promise/recommended", "prettier"],
    plugins: ["@typescript-eslint", "import", "jest"],
    rules: {
        "vue/attributes-order": "off",
        "no-prototype-builtins": "off",
        "import/no-default-export": "off",
        "@typescript-eslint/no-explicit-any": ["off"],
        "no-use-before-define": ["error", { functions: false, classes: true, variables: false }],
        "@typescript-eslint/no-use-before-define": [
            "error",
            { functions: false, classes: true, variables: false, typedefs: true }
        ],
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/explicit-function-return-type": [
            "off",
            {
                allowExpressions: true,
                allowHigherOrderFunctions: true,
                allowTypedFunctionExpressions: true
            }
        ],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["off"]
    }
}
