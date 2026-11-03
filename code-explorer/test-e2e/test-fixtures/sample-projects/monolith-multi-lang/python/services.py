from dataclasses import dataclass
from enum import Enum
from typing import Protocol

class Repository(Protocol):
    def find_all(self) -> list: ...

class Status(Enum):
    ACTIVE = 1
    INACTIVE = 2

@dataclass
class Config:
    app_name: str
    debug: bool = False

class UserService:
    def __init__(self, repo: 'Repository'):
        self.repo = repo
        self._cache = {}
        self.__secret = "hidden"

    @property
    def is_active((self) -> bool:
        return True

    @staticmethod
    def get_version() -> str:
        return "1.0"