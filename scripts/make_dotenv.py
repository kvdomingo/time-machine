import sys
from pathlib import Path
from typing import Literal

from loguru import logger
from mako.template import Template

from .get_secret_string import get_secret_string

BASE_DIR = Path(__file__).parent.parent


def make_dotenv(env_dir: Literal["dev", "prod"]):
    template = Template(filename=str(BASE_DIR / "scripts" / ".env.mako"))
    env = template.render(SECRET_KEY=get_secret_string("SECRET_KEY"))
    with open(BASE_DIR / "deploy" / env_dir / ".env", "w+") as f:
        f.write(env)

    logger.info(".env ok")


if __name__ == "__main__":
    make_dotenv((sys.argv[1:2] or ["prod"])[0])
