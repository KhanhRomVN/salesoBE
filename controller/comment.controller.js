const CommentModel = require('../models/CommentModel');
const logger = require('../config/logger');

//* Create Comment
const createComment = async (req, res) => {
    const user_id = req.user._id.toString();
    const { content, image, post_id } = req.body;
    try {
        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }
        const commentData = {
            content,
            post_id,
            image: image || "",
            create_at: new Date(),
            update_at: new Date(),
        };
        await CommentModel.createComment(user_id, commentData);
        res.status(201).json({ message: "Comment created successfully" });
    } catch (error) {
        logger.error(`Create comment failed: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
};

//* Delete Comment
const deleteComment = async (req, res) => {
    const user_id = req.user._id.toString();
    const { comment_id } = req.body;
    try {
        const comment = await CommentModel.getCommentByCommentId(comment_id);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        if (comment.user_id !== user_id) {
            return res.status(403).json({ error: "Unauthorized to delete this comment" });
        }
        await CommentModel.deleteComment(comment_id);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        logger.error(`Delete comment failed: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
};

//* Update Comment Content
const updateContent = async (req, res) => {
    const { comment_id, content } = req.body;
    try {
        await CommentModel.updateContent(comment_id, content);
        res.status(200).json({ message: "Content updated successfully" });
    } catch (error) {
        logger.error(`Update content failed: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
};

//* Update Comment Image
const updateImage = async (req, res) => {
    const { comment_id, image } = req.body;
    try {
        await CommentModel.updateImage(comment_id, image);
        res.status(200).json({ message: "Image updated successfully" });
    } catch (error) {
        logger.error(`Update image failed: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
};

//* Delete Comment Image
const delImage = async (req, res) => {
    const { comment_id } = req.body;
    try {
        await CommentModel.delImage(comment_id);
        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        logger.error(`Delete image failed: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getListCommentByPostId = async (req, res) => {
    const { post_id } = req.body;
    try {
        const comments = await CommentModel.getListCommentByPostId(post_id);
        res.status(200).json(comments);
    } catch (error) {
        logger.error(`Get list comment by post id failed: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    createComment,
    deleteComment,
    updateContent,
    updateImage,
    delImage,
    getListCommentByPostId
};
