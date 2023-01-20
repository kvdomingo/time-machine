import re
import sys
from pathlib import Path
from typing import Literal

from loguru import logger

BASE_DIR = Path(__file__).parent.parent


def make_dotenvrc(env_dir: Literal["dev", "prod"]):
    with open(BASE_DIR / "deploy" / env_dir / ".env", "r") as f:
        env = f.readlines()
    for i, line in enumerate(env):
        if len(line) > 0 and not re.match(r"^\s+$", line):
            env[i] = f"export {line}"
    with open(BASE_DIR / ".envrc", "w+") as f:
        f.writelines(env)

    logger.info(".envrc ok")


if __name__ == "__main__":
    make_dotenvrc((sys.argv[1:2] or ["prod"])[0])
