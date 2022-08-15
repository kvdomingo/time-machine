from typing import Optional

from pydantic import UUID4, BaseModel, EmailStr, Field


class CognitoUser(BaseModel):
    id: Optional[UUID4 | str]
    email: EmailStr
    username: str
    is_admin: bool = Field(default=False)
    is_active: bool = Field(default=True)

    def dict(self, *args, **kwargs):
        self.id = str(self.id)
        return super().dict(*args, **kwargs)
