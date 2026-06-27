"""
Router auto-discovery.
Mirrors the same pattern used in the trading bot:
  - Scans every module in this package
  - Picks up any module-level `router` attribute (an APIRouter instance)
  - Returns them for app.include_router() in main.py
"""

import pkgutil
import importlib
from pathlib import Path
from fastapi import APIRouter


def discover_routers() -> list[APIRouter]:
    """
    Scan the routers package and return all APIRouter instances found.
    Adding a new router file automatically registers it — no changes to main.py needed.
    """
    package_dir = Path(__file__).resolve().parent
    routers = []

    for module_info in pkgutil.iter_modules([str(package_dir)]):
        if module_info.name.startswith("_"):
            continue

        module = importlib.import_module(f"routers.{module_info.name}")

        if hasattr(module, "router") and isinstance(module.router, APIRouter):
            routers.append(module.router)
            print(f"  🔌 Registered router: routers.{module_info.name}  ({module.router.prefix})")

    return routers
