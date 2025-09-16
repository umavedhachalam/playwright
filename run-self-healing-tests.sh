#!/bin/bash

# Self-Healing Playwright Test Runner
# This script demonstrates the self-healing capabilities

echo "🚀 Starting Self-Healing Playwright Tests"
echo "=========================================="

# Set environment variables for testing
export LOGIN_USERNAME="test123"
export LOGIN_PASSWORD="testpass123"
export NODE_ENV="development"

echo "📋 Configuration:"
echo "  - Username: $LOGIN_USERNAME"
echo "  - Password: $LOGIN_PASSWORD"
echo "  - Environment: $NODE_ENV"
echo ""

# Create test-results directory if it doesn't exist
mkdir -p test-results

echo "🧪 Running Self-Healing Demo Tests..."
echo "------------------------------------"
npx playwright test tests/self-healing-demo.spec.ts --headed --reporter=line

echo ""
echo "🔧 Running Self-Healing Login Tests..."
echo "--------------------------------------"
npx playwright test tests/self-healing-login.spec.ts --headed --reporter=line

echo ""
echo "🔄 Running Updated Original Tests..."
echo "------------------------------------"
npx playwright test tests/login.spec.ts --headed --reporter=line

echo ""
echo "📊 Test Results Summary:"
echo "========================"
echo "Check the test-results/ directory for:"
echo "  - Screenshots from self-healing attempts"
echo "  - Detailed execution logs"
echo "  - Error reports and debugging information"
echo ""
echo "🎯 Self-Healing Features Demonstrated:"
echo "  ✅ Multiple selector strategies with fallbacks"
echo "  ✅ Automatic retry mechanisms"
echo "  ✅ Element discovery and learning"
echo "  ✅ Adaptive wait strategies"
echo "  ✅ Error recovery and debugging"
echo "  ✅ Screenshot capture on failures"
echo "  ✅ Comprehensive logging"
echo ""
echo "✨ Self-healing tests completed!"
