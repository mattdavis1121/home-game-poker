from flask import json
from flask_login import current_user
from flask_sse import ServerSentEventsBlueprint, Message

from app import app
from models import SSEChannel


class SSE(ServerSentEventsBlueprint):
    def messages(self, channel='sse'):
        """
        Generate an infinite stream of messages from the given Redis channel

        This method creates a new Redis pubsub connection and stores its
        ID back into the application's database. This is used on client
        disconnect to clean up lingering connections.
        """
        redis = self.redis
        SSEChannel.create(user_id=current_user.id, sse_id=redis.client_id())
        pubsub = redis.pubsub()
        pubsub.subscribe(channel)
        for pubsub_message in pubsub.listen():
            if pubsub_message['type'] == 'message':
                msg_dict = json.loads(pubsub_message['data'])
                yield Message(**msg_dict)


sse = SSE('sse', __name__)
sse.add_url_rule(rule="", endpoint="stream", view_func=sse.stream)
app.register_blueprint(sse, url_prefix="/stream")
