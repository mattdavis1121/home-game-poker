class Error(Exception):
    """Base class for other exceptions"""
    pass


class TableFullError(Error):
    """A user is trying to join a table with no unoccupied seats"""
    pass


class SeatOccupiedError(Error):
    """A user is trying to sit down at an occupied seat"""
    pass


class DuplicateActiveRecordError(Error):
    """Cannot have more than one active record per parent at a time"""
    pass


class InsufficientPlayersError(Error):
    """Not enough players at table to begin a hand"""
    pass

