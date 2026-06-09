const spec = {
  openapi: "3.0.3",
  info: {
    title: "Todo App API",
    version: "1.0.0",
    description: "Fullstack todo application with AI-powered suggestions",
  },
  servers: [
    { url: "/", description: "Local development" },
  ],
  paths: {
    "/api/todos": {
      get: {
        summary: "List all todos",
        tags: ["Todos"],
        responses: {
          "200": {
            description: "Array of todos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Todo" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a todo",
        tags: ["Todos"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: {
                    type: "string",
                    description: "Todo title",
                    example: "Buy groceries",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Created todo",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Todo" },
              },
            },
          },
          "400": { description: "Title is required" },
        },
      },
    },
    "/api/todos/{id}": {
      patch: {
        summary: "Toggle todo completion",
        tags: ["Todos"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["completed"],
                properties: {
                  completed: {
                    type: "boolean",
                    example: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated todo",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Todo" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete a todo",
        tags: ["Todos"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/suggestions": {
      get: {
        summary: "Get AI-powered todo suggestions",
        tags: ["Suggestions"],
        parameters: [
          {
            name: "topic",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Topic for suggestions (e.g., work, health)",
            example: "work",
          },
        ],
        responses: {
          "200": {
            description: "Array of suggestion strings",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    suggestions: {
                      type: "array",
                      items: { type: "string" },
                      example: [
                        "Complete project report",
                        "Reply to pending emails",
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Todo: {
        type: "object",
        properties: {
          id: { type: "string", example: "clx123abc..." },
          title: { type: "string", example: "Buy groceries" },
          completed: { type: "boolean", example: false },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-09T10:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-09T10:00:00.000Z",
          },
        },
      },
    },
  },
} as const;

export default spec;
