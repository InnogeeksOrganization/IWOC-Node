const AdminBro = require("admin-bro");
const AdminBroExpressjs = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");
const mongoose = require("mongoose");
const project = require("../config/project");
const user = require("../config/user");
const eventregistrations = require("../config/event");
const admins = require("../config/admins");

AdminBro.registerAdapter(AdminBroMongoose);

const canModifyUsers = ({ currentAdmin }) =>
  currentAdmin && currentAdmin.role === "admin";

const canEditEmp = ({ currentAdmin, record }) => {
  return currentAdmin && currentAdmin.role === "admin";
};

AdminBro.registerAdapter(AdminBroMongoose);
const AdminBroOptions = {
  resources: [
    {
      resource: project,
      options: {
        properties: {
          ownerId: {
            isVisible: { edit: false, show: true, list: true, filter: true },
          },
        },
        actions: {
          edit: { isAccessible: canEditEmp },
          delete: { isAccessible: canEditEmp },
          new: { isAccessible: canEditEmp },
        },
      },
    },
    {
        resource: user,
        options: {
          properties: {
            ownerId: {
              isVisible: { edit: false, show: true, list: true, filter: true },
            },
          },
          actions: {
            edit: { isAccessible: canEditEmp },
            delete: { isAccessible: canEditEmp },
            new: { isAccessible: canEditEmp },
          },
        },
      },
      {
        resource: eventregistrations,
        options: {
          properties: {
            ownerId: {
              isVisible: { edit: false, show: true, list: true, filter: true },
            },
          },
          actions: {
            edit: { isAccessible: canEditEmp },
            delete: { isAccessible: canEditEmp },
            new: { isAccessible: canEditEmp },
          },
        },
      },
    {
      resource: admins,
      options: {
        properties: {
          encryptedPassword: { isVisible: false },
          password: {
            type: "string",
            isVisible: {
              list: false,
              edit: true,
              filter: false,
              show: false,
            },
          },
        },
        actions: {
          new: {
            before: async (request) => {
              if (request.payload.record.password) {
                request.payload.record = {
                  ...request.payload.record,
                  encryptedPassword: await bcrypt.hash(
                    request.payload.record.password,
                    10
                  ),
                  password: undefined,
                };
              }
              return request;
            },
          },
          edit: { isAccessible: canModifyUsers },
          delete: { isAccessible: canModifyUsers },
          new: { isAccessible: canModifyUsers },
        },
      },
    },
  ],
};

const adminBro = new AdminBro(AdminBroOptions);
const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await admins.findOne({ email });
    if (user) {
      if (password === user.encryptedPassword) {
        return user;
      }
    }
    return false;
  },
  cookiePassword: "session Key",
});

module.exports = router;
