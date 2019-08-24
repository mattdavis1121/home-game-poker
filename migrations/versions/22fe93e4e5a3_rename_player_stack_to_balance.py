"""Rename player.stack to balance

Revision ID: 22fe93e4e5a3
Revises: 1e77ac97ec6e
Create Date: 2019-08-24 13:14:06.304337

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '22fe93e4e5a3'
down_revision = '1e77ac97ec6e'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('players', 'stack', new_column_name='balance')


def downgrade():
    op.alter_column('players', 'balance', new_column_name='stack')
