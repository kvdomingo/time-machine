from pydantic import BaseModel


class AwsError(BaseModel):
    status: int
    error: str | dict[str, str]
