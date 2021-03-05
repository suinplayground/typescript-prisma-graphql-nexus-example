import { GraphQLDateTime } from "graphql-iso-date";
import {
  arg,
  asNexusMethod,
  inputObjectType,
  makeSchema,
  nonNull,
  objectType,
} from "nexus";
import { Context } from "./context";

export const DateTime = asNexusMethod(GraphQLDateTime, "date");

const Query = objectType({
  name: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("allInvoices", {
      type: "Invoice",
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.invoice.findMany();
      },
    });
  },
});

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.nonNull.field("createInvoice", {
      type: "Invoice",
      args: {
        data: nonNull(
          arg({
            type: "CreateInvoiceInput",
          })
        ),
      },
      resolve: (_, args, context: Context) => {
        const items = args.data.items.map((item) => {
          return { ...item, total: item.price * item.quantity };
        });
        const total = items.reduce((total, item) => total + item.total, 0);
        return context.prisma.invoice.create({
          data: {
            billingDate: args.data.billingDate,
            total: total,
            items: {
              create: items,
            },
          },
        });
      },
    });
  },
});

const Invoice = objectType({
  name: "Invoice",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("total");
    t.nonNull.date("billingDate");
    t.nonNull.list.nonNull.field("items", {
      type: "InvoiceItem",
      resolve: (parent, _, context: Context) => {
        return context.prisma.invoice
          .findUnique({
            where: { id: parent.id },
          })
          .items();
      },
    });
  },
});

const InvoiceItem = objectType({
  name: "InvoiceItem",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.int("price");
    t.nonNull.int("quantity");
    t.nonNull.int("total");
  },
});

const CreateInvoiceInput = inputObjectType({
  name: "CreateInvoiceInput",
  definition: (t) => {
    t.nonNull.date("billingDate");
    t.nonNull.list.nonNull.field("items", {
      type: "CreateInvoiceItemInput",
    });
  },
});

const CreateInvoiceItemInput = inputObjectType({
  name: "CreateInvoiceItemInput",
  definition: (t) => {
    t.nonNull.string("name");
    t.nonNull.int("price");
    t.nonNull.int("quantity");
  },
});

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    Invoice,
    InvoiceItem,
    CreateInvoiceInput,
    CreateInvoiceItemInput,
    DateTime,
  ],
  outputs: {
    schema: __dirname + "/../schema.graphql",
    typegen: __dirname + "/generated/nexus.ts",
  },
  contextType: {
    module: require.resolve("./context"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
});
