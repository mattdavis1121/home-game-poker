import json
from flask_sse import ServerSentEventsBlueprint, Message


class SSE(ServerSentEventsBlueprint):
    def messages(self, channel='sse', ):
        """
        A generator of :class:`~flask_sse.Message` objects from the given channel.


        """
        redis = self.redis
        redis.client_setname(channel)
        pubsub = redis.pubsub()
        pubsub.subscribe(channel)
        for pubsub_message in pubsub.listen():
            if pubsub_message['type'] == 'message':
                msg_dict = json.loads(pubsub_message['data'])
                yield Message(**msg_dict)


sse = SSE('sse', __name__)
sse.add_url_rule(rule="", endpoint="stream", view_func=sse.stream)