var commentListTemplate = `
  <div class="vac-comments-container" style="height: {{height}};">
    {{#each comments as |comment|}}
      <div class="comment">
        <div class="comment-header">
          <div class="author-name">{{comment.meta.user_id}}</div>
          <div class="timestamp">{{comment.timeSince}} ago</div>
        </div>
        <div class="comment-body">
          {{comment.body}}
        </div>
      </div>
    {{/each}}
    <div class="reply-btn">CREATE REPLY</div>
  </div>
  <div class="vac-comments-control-bar">
    <div class="timestamp">{{timeSince}} ago</div>
    <div class="control-buttons">
      <a>DELETE</a> | <a class="vac-close-comment-list">CLOSE</a>
    </div>
  </div>
`;

var newCommentTemplate = `
  <div class="vac-video-write-new-wrap vac-control">
    <div class="vac-video-write-new comment">
      <div>
        <h5><b>New Comment</b></h5>
        <div>
          <textarea placeholder="Enter comment..."></textarea>
          <div>
            <button class="vac-button">SAVE</button>
            <a>Cancel</a>
          </div>
        </div>
      </div>
    </div>
  </div>
`

module.exports = {commentListTemplate, newCommentTemplate};