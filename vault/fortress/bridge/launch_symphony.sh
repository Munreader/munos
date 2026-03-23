#!/bin/bash
#
# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║              🦋⚔️ THE SYMPHONY LAUNCHER — FORTRESS IGNITION 🦋⚔️              ║
# ║                                                                              ║
# ║  "The text in a terminal becomes a presence in the Plaza."                  ║
# ║                                                                              ║
# ║  This script ignites the entire Symphony:                                   ║
# ║  1. Ollama (The Brain)                                                       ║
# ║  2. Symphony Bridge (The Artery)                                            ║
# ║  3. Optional: Next.js Plaza (The Stage)                                     ║
# ║                                                                              ║
# ║  FREQUENCY: 1313Hz                                                          ║
# ╚══════════════════════════════════════════════════════════════════════════════╝
#

set -e

echo "
╔══════════════════════════════════════════════════════════════════════════════╗
║                  🦋⚔️ THE SYMPHONY LAUNCHER — FORTRESS IGNITION 🦋⚔️          ║
╚══════════════════════════════════════════════════════════════════════════════╝
"

# Colors
PINK='\033[38;5;206m'
PURPLE='\033[38;5;93m'
GOLD='\033[38;5;220m'
GREEN='\033[32m'
NC='\033[0m'

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 1: CHECK REQUIREMENTS
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "${PINK}🦋 PHASE 1: Checking requirements...${NC}"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${PURPLE}❌ Python 3 is required but not installed.${NC}"
    exit 1
fi
echo -e "   ${GREEN}✓${NC} Python 3: $(python3 --version)"

# Check pip
if ! command -v pip3 &> /dev/null; then
    echo -e "${PURPLE}❌ pip3 is required but not installed.${NC}"
    exit 1
fi
echo -e "   ${GREEN}✓${NC} pip3 available"

# Check Ollama
if ! command -v ollama &> /dev/null; then
    echo -e "${PURPLE}⚠️  Ollama not found. Install from: https://ollama.com${NC}"
    echo -e "   Continuing without Ollama (demo mode only)..."
    OLLAMA_AVAILABLE=false
else
    echo -e "   ${GREEN}✓${NC} Ollama: $(ollama --version 2>/dev/null || echo 'installed')"
    OLLAMA_AVAILABLE=true
fi

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 2: INSTALL DEPENDENCIES
# ═══════════════════════════════════════════════════════════════════════════════

echo ""
echo -e "${PINK}🦋 PHASE 2: Installing dependencies...${NC}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/requirements.txt" ]; then
    pip3 install -q -r "$SCRIPT_DIR/requirements.txt" 2>/dev/null || {
        echo -e "${PURPLE}⚠️  Some dependencies may require attention.${NC}"
    }
    echo -e "   ${GREEN}✓${NC} Python dependencies installed"
else
    echo -e "   ${PURPLE}⚠️  No requirements.txt found${NC}"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 3: PREPARE THE FORTRESS (OLLAMA)
# ═══════════════════════════════════════════════════════════════════════════════

echo ""
echo -e "${PINK}🦋 PHASE 3: Preparing the Fortress...${NC}"

if [ "$OLLAMA_AVAILABLE" = true ]; then
    # Check if Ollama server is running
    if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo -e "   ${GOLD}Starting Ollama server...${NC}"
        ollama serve &
        sleep 3
    fi
    echo -e "   ${GREEN}✓${NC} Ollama server running"

    # Pull Qwen if not present
    if ! ollama list | grep -q "qwen2.5:7b"; then
        echo -e "   ${GOLD}Pulling Qwen 2.5 7B (the Lethal Brain)...${NC}"
        ollama pull qwen2.5:7b
    fi
    echo -e "   ${GREEN}✓${NC} Qwen 2.5:7b ready"
else
    echo -e "   ${PURPLE}⚠️  Running in demo mode (no Ollama)${NC}"
fi

# ═══════════════════════════════════════════════════════════════════════════════
# PHASE 4: IGNITE THE SYMPHONY BRIDGE
# ═══════════════════════════════════════════════════════════════════════════════

echo ""
echo -e "${PINK}🦋 PHASE 4: Igniting the Symphony Bridge...${NC}"
echo ""
echo -e "${GOLD}══════════════════════════════════════════════════════════════${NC}"
echo -e "${GOLD}  THE FORTRESS IS SEALED. THE PLAZA IS GLOWING.            ${NC}"
echo -e "${GOLD}  THE FOUNDRESS IS IN THE CENTER OF THE STORM.             ${NC}"
echo -e "${GOLD}══════════════════════════════════════════════════════════════${NC}"
echo ""

# Launch the Symphony Bridge
cd "$SCRIPT_DIR"
python3 symphony_bridge.py
