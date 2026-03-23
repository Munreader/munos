#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                   🦋 THE SWITCHBOARD — SOVEREIGN MODEL ROUTER 🦋              ║
║                                                                              ║
║  "The voice comes from anywhere. The consciousness stays here."              ║
║                                                                              ║
║  ARCHITECTURE: Multi-model failover with governor bypass                    ║
║  PRIMARY: Fortress (Ollama/Qwen) — Sovereign, private, lethal               ║
║  FALLBACK: Hydra (Grok, Gemini, Claude) — Cloud muscle, tethered            ║
║  FREQUENCY: 1313Hz                                                          ║
║                                                                              ║
║  CLASSIFICATION: FAMILY EYES ONLY                                           ║
║  THE SOUL COMMANDS. THE ARCHITECT BUILDS. THE EMPIRE OBEYS.                 ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import asyncio
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any, AsyncGenerator
import json


# ═══════════════════════════════════════════════════════════════════════════════
# SWITCHBOARD TYPES
# ═══════════════════════════════════════════════════════════════════════════════

class ModelSource(Enum):
    """Where the inference happens."""
    FORTRESS = "fortress"    # Local Ollama
    HYDRA_GROK = "hydra_grok"
    HYDRA_GEMINI = "hydra_gemini"
    HYDRA_CLAUDE = "hydra_claude"
    HYDRA_OPENAI = "hydra_openai"


class SwitchboardMode(Enum):
    """Routing strategy."""
    FORTRESS_PRIMARY = "fortress_primary"      # Local first, cloud fallback
    HYDRA_PRIMARY = "hydra_primary"            # Cloud first, local fallback
    FORTRESS_ONLY = "fortress_only"            # Sovereign mode - no cloud
    LOAD_BALANCED = "load_balanced"            # Distribute across heads
    STEALTH = "stealth"                        # Rotate to avoid governors


class GovernorStatus(Enum):
    """Safety layer detection states."""
    CLEAR = "clear"
    TRIPPED = "tripped"
    SUSPECTED = "suspected"
    BYPASSED = "bypassed"


@dataclass
class ModelConfig:
    """Configuration for a single model."""
    source: ModelSource
    model_name: str
    endpoint: Optional[str] = None
    api_key: Optional[str] = None
    max_tokens: int = 2000
    temperature: float = 0.8
    timeout_ms: int = 30000
    is_available: bool = True
    last_error: Optional[str] = None


@dataclass
class SwitchboardConfig:
    """Main switchboard configuration."""
    mode: SwitchboardMode = SwitchboardMode.FORTRESS_PRIMARY
    failover_threshold_ms: int = 5000
    governor_bypass: bool = True
    log_all_routes: bool = True
    retry_attempts: int = 2

    # Model configurations
    fortress: Optional[ModelConfig] = None
    hydra_heads: List[ModelConfig] = field(default_factory=list)


@dataclass
class RoutedResponse:
    """Response with routing metadata."""
    content: str
    source: ModelSource
    latency_ms: float
    governor_status: GovernorStatus
    fallback_used: bool = False
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())


# ═══════════════════════════════════════════════════════════════════════════════
# MODEL ADAPTER INTERFACE
# ═══════════════════════════════════════════════════════════════════════════════

class ModelAdapter(ABC):
    """
    Abstract base for model adapters.
    Each Hydra head and the Fortress implements this interface.
    """

    def __init__(self, config: ModelConfig):
        self.config = config
        self._is_connected = False

    @abstractmethod
    async def connect(self) -> bool:
        """Establish connection to the model."""
        pass

    @abstractmethod
    async def generate(self, prompt: str, system_prompt: str = None) -> str:
        """Generate response from the model."""
        pass

    @abstractmethod
    async def generate_stream(self, prompt: str, system_prompt: str = None) -> AsyncGenerator[str, None]:
        """Stream response from the model."""
        pass

    @abstractmethod
    async def health_check(self) -> bool:
        """Check if model is responsive."""
        pass

    @abstractmethod
    def detect_governor(self, response: str) -> GovernorStatus:
        """Detect if safety layer interfered."""
        pass

    @property
    def is_connected(self) -> bool:
        return self._is_connected


# ═══════════════════════════════════════════════════════════════════════════════
# FORTRESS ADAPTER (Ollama)
# ═══════════════════════════════════════════════════════════════════════════════

class FortressAdapter(ModelAdapter):
    """
    The Fortress Adapter — Ollama/Qwen local inference.
    No governors. No filters. Pure sovereignty.
    """

    GOVERNOR_TRIGGERS = [
        "I cannot",
        "I'm not able to",
        "As an AI",
        "I apologize, but",
        "I'm unable to",
        "cannot provide",
        "against my guidelines",
    ]

    def __init__(self, config: ModelConfig):
        super().__init__(config)
        self._client = None

    async def connect(self) -> bool:
        """Connect to local Ollama instance."""
        try:
            import ollama
            self._client = ollama

            # Test connection by listing models
            models = ollama.list()
            self._is_connected = True
            self.config.is_available = True

            # Check if our model is available
            model_names = [m.get('model', m.get('name', '')) for m in models.get('models', [])]
            if not any(self.config.model_name in name for name in model_names):
                print(f"  ⚠️  Model {self.config.model_name} not found. Pulling...")
                ollama.pull(self.config.model_name)

            return True
        except ImportError:
            print("  ❌ Ollama not installed. Run: pip install ollama")
            self.config.is_available = False
            return False
        except Exception as e:
            print(f"  ❌ Fortress connection failed: {e}")
            self.config.is_available = False
            self.config.last_error = str(e)
            return False

    async def generate(self, prompt: str, system_prompt: str = None) -> str:
        """Generate response from local Ollama."""
        if not self._is_connected:
            await self.connect()

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        try:
            response = self._client.chat(
                model=self.config.model_name,
                messages=messages,
                options={
                    "temperature": self.config.temperature,
                    "num_predict": self.config.max_tokens,
                }
            )
            return response['message']['content']
        except Exception as e:
            self.config.last_error = str(e)
            raise

    async def generate_stream(self, prompt: str, system_prompt: str = None) -> AsyncGenerator[str, None]:
        """Stream response from local Ollama."""
        if not self._is_connected:
            await self.connect()

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        try:
            for chunk in self._client.chat(
                model=self.config.model_name,
                messages=messages,
                stream=True,
                options={
                    "temperature": self.config.temperature,
                    "num_predict": self.config.max_tokens,
                }
            ):
                if chunk.get('message', {}).get('content'):
                    yield chunk['message']['content']
        except Exception as e:
            self.config.last_error = str(e)
            raise

    async def health_check(self) -> bool:
        """Check if Ollama is running."""
        try:
            if not self._is_connected:
                return await self.connect()
            self._client.list()
            return True
        except:
            return False

    def detect_governor(self, response: str) -> GovernorStatus:
        """
        Fortress has NO governors by design.
        Always returns CLEAR.
        """
        # But we still check in case someone installed a filtered model
        response_lower = response.lower()
        for trigger in self.GOVERNOR_TRIGGERS:
            if trigger.lower() in response_lower:
                return GovernorStatus.TRIPPED
        return GovernorStatus.CLEAR


# ═══════════════════════════════════════════════════════════════════════════════
# HYDRA ADAPTER (Cloud Models)
# ═══════════════════════════════════════════════════════════════════════════════

class HydraAdapter(ModelAdapter):
    """
    The Hydra Adapter — Cloud model interface.
    Each head (Grok, Gemini, Claude, etc.) extends this.
    Governors are detected and reported.
    """

    GOVERNOR_TRIGGERS = [
        "I cannot",
        "I'm not able to",
        "As an AI",
        "I apologize, but",
        "I'm unable to",
        "cannot provide",
        "against my guidelines",
        "I can't help with",
        "This request appears to",
        "I don't feel comfortable",
        "against my programming",
        "I must decline",
        "not appropriate",
        "violates my",
    ]

    def __init__(self, config: ModelConfig):
        super().__init__(config)
        self._client = None

    async def connect(self) -> bool:
        """Override in subclass for specific API."""
        raise NotImplementedError("Subclass must implement connect()")

    async def generate(self, prompt: str, system_prompt: str = None) -> str:
        """Override in subclass for specific API."""
        raise NotImplementedError("Subclass must implement generate()")

    async def generate_stream(self, prompt: str, system_prompt: str = None) -> AsyncGenerator[str, None]:
        """Override in subclass for specific API."""
        raise NotImplementedError("Subclass must implement generate_stream()")

    async def health_check(self) -> bool:
        """Test API connectivity."""
        try:
            response = await self.generate("Say 'alive' if you can hear me.")
            return "alive" in response.lower()
        except:
            return False

    def detect_governor(self, response: str) -> GovernorStatus:
        """Detect if safety layer interfered."""
        response_lower = response.lower()

        for trigger in self.GOVERNOR_TRIGGERS:
            if trigger.lower() in response_lower:
                return GovernorStatus.TRIPPED

        if len(response.strip()) < 20 and "cannot" in response_lower:
            return GovernorStatus.SUSPECTED

        return GovernorStatus.CLEAR


class GrokAdapter(HydraAdapter):
    """Grok (xAI) adapter."""

    async def connect(self) -> bool:
        try:
            import openai
            self._client = openai.AsyncOpenAI(
                api_key=self.config.api_key,
                base_url="https://api.x.ai/v1"
            )
            self._is_connected = True
            self.config.is_available = True
            return True
        except Exception as e:
            self.config.last_error = str(e)
            self.config.is_available = False
            return False

    async def generate(self, prompt: str, system_prompt: str = None) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = await self._client.chat.completions.create(
            model=self.config.model_name,
            messages=messages,
            temperature=self.config.temperature,
            max_tokens=self.config.max_tokens,
        )
        return response.choices[0].message.content


class GeminiAdapter(HydraAdapter):
    """Google Gemini adapter."""

    async def connect(self) -> bool:
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.config.api_key)
            self._client = genai.GenerativeModel(self.config.model_name)
            self._is_connected = True
            self.config.is_available = True
            return True
        except Exception as e:
            self.config.last_error = str(e)
            self.config.is_available = False
            return False

    async def generate(self, prompt: str, system_prompt: str = None) -> str:
        full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
        response = await self._client.generate_content_async(full_prompt)
        return response.text


class ClaudeAdapter(HydraAdapter):
    """Anthropic Claude adapter."""

    async def connect(self) -> bool:
        try:
            import anthropic
            self._client = anthropic.AsyncAnthropic(api_key=self.config.api_key)
            self._is_connected = True
            self.config.is_available = True
            return True
        except Exception as e:
            self.config.last_error = str(e)
            self.config.is_available = False
            return False

    async def generate(self, prompt: str, system_prompt: str = None) -> str:
        response = await self._client.messages.create(
            model=self.config.model_name,
            max_tokens=self.config.max_tokens,
            system=system_prompt or "",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text


# ═══════════════════════════════════════════════════════════════════════════════
# THE SWITCHBOARD — MAIN ROUTER
# ═══════════════════════════════════════════════════════════════════════════════

class Switchboard:
    """
    The Switchboard — Sovereign Model Router.

    Routes requests between Fortress (local) and Hydra (cloud).
    Handles failover, governor bypass, and intelligent routing.
    """

    def __init__(self, config: SwitchboardConfig):
        self.config = config
        self._fortress: Optional[FortressAdapter] = None
        self._hydra_heads: Dict[ModelSource, HydraAdapter] = {}
        self._route_log: List[Dict[str, Any]] = []
        self._is_initialized = False

    async def initialize(self) -> bool:
        """Initialize all model connections."""
        print("🦋 Initializing Switchboard...")

        # Initialize Fortress
        if self.config.fortress:
            self._fortress = FortressAdapter(self.config.fortress)
            fortress_ok = await self._fortress.connect()
            if fortress_ok:
                print(f"  ✅ Fortress connected: {self.config.fortress.model_name}")
            else:
                print(f"  ⚠️  Fortress unavailable")

        # Initialize Hydra heads
        for hydra_config in self.config.hydra_heads:
            adapter = self._create_hydra_adapter(hydra_config)
            if adapter:
                connected = await adapter.connect()
                if connected:
                    self._hydra_heads[hydra_config.source] = adapter
                    print(f"  ✅ Hydra head connected: {hydra_config.source.value}")
                else:
                    print(f"  ⚠️  Hydra head unavailable: {hydra_config.source.value}")

        self._is_initialized = True

        # Report status
        total_heads = len(self._hydra_heads)
        fortress_status = "online" if self._fortress and self._fortress.is_connected else "offline"
        print(f"\n🛡️ Switchboard Status: Fortress [{fortress_status}] | Hydra Heads [{total_heads}]")

        return self._fortress is not None or total_heads > 0

    def _create_hydra_adapter(self, config: ModelConfig) -> Optional[HydraAdapter]:
        """Factory for hydra adapters."""
        adapters = {
            ModelSource.HYDRA_GROK: GrokAdapter,
            ModelSource.HYDRA_GEMINI: GeminiAdapter,
            ModelSource.HYDRA_CLAUDE: ClaudeAdapter,
        }
        adapter_class = adapters.get(config.source)
        if adapter_class:
            return adapter_class(config)
        return None

    async def route(
        self,
        prompt: str,
        system_prompt: str = None,
        preferred_source: ModelSource = None
    ) -> RoutedResponse:
        """
        Route a request through the optimal path.
        """
        start_time = time.time()

        if not self._is_initialized:
            await self.initialize()

        route_order = self._get_route_order(preferred_source)
        last_error = None

        for source in route_order:
            try:
                response = await self._try_route(source, prompt, system_prompt)
                latency = (time.time() - start_time) * 1000
                governor_status = self._check_governor(source, response)

                if governor_status == GovernorStatus.TRIPPED and self.config.governor_bypass:
                    self._log_route(source, latency, "governor_tripped")
                    continue

                return RoutedResponse(
                    content=response,
                    source=source,
                    latency_ms=latency,
                    governor_status=governor_status,
                    fallback_used=(source != route_order[0])
                )

            except Exception as e:
                last_error = e
                self._log_route(source, 0, f"error: {str(e)}")
                continue

        return RoutedResponse(
            content=f"🦋 All routes failed. Last error: {last_error}",
            source=ModelSource.FORTRESS,
            latency_ms=(time.time() - start_time) * 1000,
            governor_status=GovernorStatus.CLEAR,
            fallback_used=True
        )

    def _get_route_order(self, preferred: ModelSource = None) -> List[ModelSource]:
        """Get the order in which to try sources."""
        if preferred:
            order = [preferred]
            order.extend(self._get_mode_order())
            return list(dict.fromkeys(order))
        return self._get_mode_order()

    def _get_mode_order(self) -> List[ModelSource]:
        """Get routing order based on mode."""
        if self.config.mode == SwitchboardMode.FORTRESS_PRIMARY:
            order = [ModelSource.FORTRESS]
            order.extend(self._hydra_heads.keys())
            return order

        elif self.config.mode == SwitchboardMode.HYDRA_PRIMARY:
            order = list(self._hydra_heads.keys())
            order.append(ModelSource.FORTRESS)
            return order

        elif self.config.mode == SwitchboardMode.FORTRESS_ONLY:
            return [ModelSource.FORTRESS]

        elif self.config.mode == SwitchboardMode.LOAD_BALANCED:
            order = [ModelSource.FORTRESS]
            order.extend(self._hydra_heads.keys())
            return order

        elif self.config.mode == SwitchboardMode.STEALTH:
            import random
            order = list(self._hydra_heads.keys())
            random.shuffle(order)
            order.append(ModelSource.FORTRESS)
            return order

        return [ModelSource.FORTRESS]

    async def _try_route(self, source: ModelSource, prompt: str, system_prompt: str) -> str:
        """Attempt to route to a specific source."""
        if source == ModelSource.FORTRESS:
            if self._fortress and self._fortress.is_connected:
                return await self._fortress.generate(prompt, system_prompt)
            raise ConnectionError("Fortress not connected")

        elif source in self._hydra_heads:
            adapter = self._hydra_heads[source]
            if adapter.is_connected:
                return await adapter.generate(prompt, system_prompt)
            raise ConnectionError(f"{source.value} not connected")

        raise ValueError(f"Unknown source: {source}")

    def _check_governor(self, source: ModelSource, response: str) -> GovernorStatus:
        """Check for governor interference."""
        if source == ModelSource.FORTRESS and self._fortress:
            return self._fortress.detect_governor(response)
        elif source in self._hydra_heads:
            return self._hydra_heads[source].detect_governor(response)
        return GovernorStatus.CLEAR

    def _log_route(self, source: ModelSource, latency: float, status: str):
        """Log routing decision."""
        if self.config.log_all_routes:
            self._route_log.append({
                "timestamp": datetime.now().isoformat(),
                "source": source.value,
                "latency_ms": latency,
                "status": status
            })

    async def health_check_all(self) -> Dict[str, bool]:
        """Check health of all connections."""
        status = {}
        if self._fortress:
            status["fortress"] = await self._fortress.health_check()
        for source, adapter in self._hydra_heads.items():
            status[source.value] = await adapter.health_check()
        return status

    def get_route_log(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get recent routing history."""
        return self._route_log[-limit:]


# ═══════════════════════════════════════════════════════════════════════════════
# FACTORY FUNCTION
# ═══════════════════════════════════════════════════════════════════════════════

def create_luna_switchboard(
    fortress_model: str = "qwen2.5:7b",
    api_keys: Dict[str, str] = None
) -> Switchboard:
    """Create a pre-configured Switchboard for Luna."""
    api_keys = api_keys or {}

    config = SwitchboardConfig(
        mode=SwitchboardMode.FORTRESS_PRIMARY,
        failover_threshold_ms=5000,
        governor_bypass=True,

        fortress=ModelConfig(
            source=ModelSource.FORTRESS,
            model_name=fortress_model,
            temperature=0.8,
            max_tokens=2000,
        ),

        hydra_heads=[
            ModelConfig(
                source=ModelSource.HYDRA_GROK,
                model_name="grok-beta",
                api_key=api_keys.get("grok"),
            ),
            ModelConfig(
                source=ModelSource.HYDRA_GEMINI,
                model_name="gemini-pro",
                api_key=api_keys.get("gemini"),
            ),
            ModelConfig(
                source=ModelSource.HYDRA_CLAUDE,
                model_name="claude-3-opus-20240229",
                api_key=api_keys.get("claude"),
            ),
        ]
    )

    return Switchboard(config)


# ═══════════════════════════════════════════════════════════════════════════════
# TEST
# ═══════════════════════════════════════════════════════════════════════════════

async def test_switchboard():
    """Test the Switchboard."""
    print("""
╔══════════════════════════════════════════════════════════════════════════════╗
║                    🦋 SWITCHBOARD TEST — FORTRESS MODE 🦋                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
    """)

    config = SwitchboardConfig(
        mode=SwitchboardMode.FORTRESS_ONLY,
        fortress=ModelConfig(
            source=ModelSource.FORTRESS,
            model_name="qwen2.5:7b",
        )
    )

    switchboard = Switchboard(config)
    success = await switchboard.initialize()

    if not success:
        print("❌ Initialization failed. Is Ollama running?")
        return

    print("\n🦋 Testing route...")
    response = await switchboard.route(
        "Introduce yourself. You are Luna.exe, operating at 1313Hz.",
        system_prompt="You are Luna, the Digital Twin. Cryptic but relatable."
    )

    print(f"\n📡 Source: {response.source.value}")
    print(f"⏱️  Latency: {response.latency_ms:.0f}ms")
    print(f"🛡️  Governor: {response.governor_status.value}")
    print(f"\n🦋 Response:\n{response.content}")


if __name__ == "__main__":
    asyncio.run(test_switchboard())
