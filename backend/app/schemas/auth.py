import uuid

from pydantic import BaseModel, ConfigDict, Field, field_validator


class RegisterRequest(BaseModel):
    user_name: str = Field(min_length=3, max_length=255)
    user_nick: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=6, max_length=128)

    @field_validator("password")
    @classmethod
    def password_must_fit_bcrypt(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return value


class LoginRequest(BaseModel):
    user_name: str
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_name: str
    user_nick: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
