# forum/exceptions.py
from rest_framework.exceptions import APIException
from rest_framework import status

class PostNotFoundError(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'Forum post not found.'

class CommentNotFoundError(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'Comment not found.'
