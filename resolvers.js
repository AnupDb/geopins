const { AuthenticationError, PubSub } = require("apollo-server");
const Pin = require("./models/Pin");

const pubSub = new PubSub();
const PIN_ADDED = "PIN_ADDED";
const PIN_DELETED = "PIN_DELETED";
const PIN_UPDATED = "PIN_UPDATED";

const authenticated = next => (_, args, ctx) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError(`You must be logged in`);
  }
  return next(_, args, ctx);
};

module.exports = {
  Query: {
    me: authenticated((_, args, ctx) => ctx.currentUser),
    getPins: async (roots, args, ctx) => {
      const pins = await Pin.find({})
        .populate("author")
        .populate("comments.author");
      return pins;
    }
  },
  Mutation: {
    createPin: authenticated(async (_, args, ctx) => {
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id
      }).save();
      const pinAdded = await Pin.populate(newPin, "author");

      pubSub.publish(PIN_ADDED, { pinAdded });
      return pinAdded;
    }),
    deletePin: authenticated(async (_, args, ctx) => {
      const pinDeleted = await Pin.findByIdAndDelete(args.pinId);
      pubSub.publish(PIN_DELETED, { pinDeleted });
      return pinDeleted;
    }),
    createComment: authenticated(async (_, args, ctx) => {
      const newComment = { text: args.text, author: ctx.currentUser._id };
      const pinUpdated = await Pin.findOneAndUpdate(
        { _id: args.pinId },
        { $push: { comments: newComment } },
        { new: true }
      )
        .populate("author")
        .populate("comments.author");
      pubSub.publish(PIN_UPDATED, { pinUpdated });

      return pinUpdated;
    })
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubSub.asyncIterator(PIN_ADDED)
    },
    pinDeleted: {
      subscribe: () => pubSub.asyncIterator(PIN_DELETED)
    },
    pinUpdated: {
      subscribe: () => pubSub.asyncIterator(PIN_UPDATED)
    }
  }
};
