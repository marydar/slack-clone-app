import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server";

export const remove = mutation({
    args:{
        channelId:v.id("channels"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if(!userId) throw new Error("Unauthorized");
        const channel = await ctx.db.get(args.channelId);
        if(!channel) throw new Error("Channel not found");
        const member = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", channel.workspaceId).eq("userId", userId))
        .unique();
        if(!member || member.role!=="admin") throw new Error("Unauthorized");

        await ctx.db.delete(args.channelId);
        return args.channelId;
    },
});
export const update = mutation({
    args:{
        channelId:v.id("channels"),
        name:v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if(!userId) throw new Error("Unauthorized");
        const channel = await ctx.db.get(args.channelId);
        if(!channel) throw new Error("Channel not found");
        const member = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", channel.workspaceId).eq("userId", userId))
        .unique();
        if(!member || member.role!=="admin") throw new Error("Unauthorized");

        await ctx.db.patch(args.channelId, {name: args.name});
        return args.channelId;
    },
});
export const create = mutation({
    args:{
        workspaceId:v.id("workspaces"),
        name:v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if(!userId) throw new Error("Unauthorized");
        const member = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
        .unique();

        if(!member || member.role!=="admin") throw new Error("Unauthorized");

        const parsedName = args.name.replace(/\s+/g, "-").toLowerCase();
        const channelId = await ctx.db.insert("channels", {
            workspaceId: args.workspaceId,
            name: parsedName,
        });
        return channelId;
    },
});

export const getById = query({
    args:{
        channelId:v.id("channels"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if(!userId) return null;
        const channel = await ctx.db.get(args.channelId)
        if(!channel) return null;
        const member = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", channel.workspaceId).eq("userId", userId))
        .unique();
        if(!member){
            return null;
        }
        return channel;
    },
});

export const get = query({
    args:{
        workspaceId:v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if(!userId) return [];
        const member = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
        .unique();
        if(!member){
            return [];
        }
        const channels = await ctx.db
        .query("channels")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
        .collect();
        return channels;
    },
});
