#!/usr/bin/env python3
"""
Test script to verify Hugging Face MCP server integration with Cursor.
This script will help you verify that the MCP server is properly connected.
"""

import json
import time
import sys
from datetime import datetime

def print_banner():
    """Print a nice banner for the test"""
    print("=" * 60)
    print("🤗 HUGGING FACE MCP SERVER TEST SUITE")
    print("=" * 60)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()

def print_test_header(test_name, description):
    """Print test header"""
    print(f"🧪 TEST: {test_name}")
    print(f"📝 Description: {description}")
    print("-" * 40)

def print_success(message):
    """Print success message"""
    print(f"✅ SUCCESS: {message}")

def print_error(message):
    """Print error message"""
    print(f"❌ ERROR: {message}")

def print_info(message):
    """Print info message"""
    print(f"ℹ️  INFO: {message}")

def wait_for_user():
    """Wait for user input to continue"""
    input("\nPress Enter to continue to the next test...")
    print()

def test_basic_functionality():
    """Test 1: Basic functionality check"""
    print_test_header("Basic MCP Integration", "Check if Cursor can communicate with the MCP server")
    
    print("This test requires manual verification in Cursor.")
    print("Please try the following in Cursor's chat:")
    print()
    print("1. Type: 'Can you search for popular text generation models on Hugging Face?'")
    print("2. You should see the MCP server respond with model search results")
    print("3. Look for JSON formatted results with model information")
    print()
    
    response = input("Did Cursor respond with Hugging Face model search results? (y/n): ").lower().strip()
    
    if response == 'y':
        print_success("Basic MCP integration is working!")
        return True
    else:
        print_error("MCP server may not be properly connected to Cursor")
        print("Check your Cursor MCP configuration")
        return False

def test_model_search():
    """Test 2: Model search functionality"""
    print_test_header("Model Search", "Test searching for specific models")
    
    test_queries = [
        "Search for BERT models on Hugging Face",
        "Find the most popular GPT models",
        "Look for image classification models",
        "Search for models with 'sentiment' in the name"
    ]
    
    print("Try these queries in Cursor one by one:")
    for i, query in enumerate(test_queries, 1):
        print(f"{i}. {query}")
    print()
    
    response = input("Did all queries return relevant model results? (y/n): ").lower().strip()
    
    if response == 'y':
        print_success("Model search functionality is working!")
        return True
    else:
        print_error("Model search may have issues")
        return False

def test_model_info():
    """Test 3: Model information retrieval"""
    print_test_header("Model Information", "Test getting detailed model information")
    
    print("Try this query in Cursor:")
    print("'Get detailed information about the model bert-base-uncased'")
    print()
    print("Expected response should include:")
    print("- Model ID, author, downloads, likes")
    print("- Tags, pipeline_tag, library_name")
    print("- Created/updated dates")
    print("- Configuration details")
    print()
    
    response = input("Did you get detailed model information? (y/n): ").lower().strip()
    
    if response == 'y':
        print_success("Model information retrieval is working!")
        return True
    else:
        print_error("Model information retrieval may have issues")
        return False

def test_dataset_search():
    """Test 4: Dataset search functionality"""
    print_test_header("Dataset Search", "Test searching for datasets")
    
    print("Try this query in Cursor:")
    print("'Search for sentiment analysis datasets on Hugging Face'")
    print()
    print("Expected response should include:")
    print("- Dataset IDs and authors")
    print("- Download counts and likes")
    print("- Task categories and tags")
    print()
    
    response = input("Did you get dataset search results? (y/n): ").lower().strip()
    
    if response == 'y':
        print_success("Dataset search functionality is working!")
        return True
    else:
        print_error("Dataset search may have issues")
        return False

def test_inference():
    """Test 5: Inference functionality (requires HF token)"""
    print_test_header("Text Generation Inference", "Test running inference through the MCP server")
    
    print("⚠️  This test requires your HF_TOKEN to be set in the MCP configuration")
    print()
    print("Try this query in Cursor:")
    print("'Generate text using gpt2 with the prompt: The future of artificial intelligence is'")
    print()
    print("Expected response should include:")
    print("- Generated text completion")
    print("- Model information")
    print("- Generation parameters used")
    print()
    
    has_token = input("Do you have HF_TOKEN configured? (y/n): ").lower().strip()
    
    if has_token == 'n':
        print_info("Skipping inference test - HF_TOKEN not configured")
        print("To enable inference, add your Hugging Face token to the MCP configuration")
        return True
    
    response = input("Did text generation work successfully? (y/n): ").lower().strip()
    
    if response == 'y':
        print_success("Text generation inference is working!")
        return True
    else:
        print_error("Text generation inference may have issues")
        print("Check your HF_TOKEN configuration")
        return False

def test_spaces_search():
    """Test 6: Spaces search functionality"""
    print_test_header("Spaces Search", "Test searching for Hugging Face Spaces")
    
    print("Try this query in Cursor:")
    print("'Search for chatbot spaces on Hugging Face'")
    print()
    print("Expected response should include:")
    print("- Space IDs and authors")
    print("- Titles and descriptions")
    print("- SDK information (Gradio, Streamlit, etc.)")
    print("- Stage and tags")
    print()
    
    response = input("Did you get spaces search results? (y/n): ").lower().strip()
    
    if response == 'y':
        print_success("Spaces search functionality is working!")
        return True
    else:
        print_error("Spaces search may have issues")
        return False

def test_error_handling():
    """Test 7: Error handling"""
    print_test_header("Error Handling", "Test how the server handles invalid requests")
    
    print("Try these intentionally problematic queries in Cursor:")
    print("1. 'Get information about a non-existent model: fake/nonexistent-model'")
    print("2. 'Search for models with an empty query'")
    print()
    print("Expected behavior:")
    print("- Should return helpful error messages")
    print("- Should not crash or hang")
    print("- Should provide guidance on valid inputs")
    print()
    
    response = input("Did error cases return helpful error messages? (y/n): ").lower().strip()
    
    if response == 'y':
        print_success("Error handling is working properly!")
        return True
    else:
        print_error("Error handling may need improvement")
        return False

def run_comprehensive_test():
    """Run a comprehensive test of the MCP integration"""
    print_test_header("Comprehensive Test", "Test multiple features in sequence")
    
    comprehensive_prompt = """
Please help me test the Hugging Face MCP server by doing the following:

1. Search for the top 3 most popular text-generation models
2. Get detailed information about 'distilbert-base-uncased'
3. Search for 2 datasets related to 'question answering'
4. Find 2 spaces related to 'image generation'
5. If you have access, try generating text with 'gpt2' using prompt: 'Hello world'

Please provide a summary of what worked and what didn't.
    """
    
    print("Copy and paste this comprehensive test prompt into Cursor:")
    print()
    print(comprehensive_prompt)
    print()
    
    response = input("Did the comprehensive test complete successfully? (y/n): ").lower().strip()
    
    if response == 'y':
        print_success("Comprehensive test passed! Your MCP server is fully functional!")
        return True
    else:
        print_error("Some parts of the comprehensive test failed")
        return False

def generate_test_report(results):
    """Generate a test report"""
    print("\n" + "=" * 60)
    print("📊 TEST REPORT")
    print("=" * 60)
    
    total_tests = len(results)
    passed_tests = sum(results.values())
    failed_tests = total_tests - passed_tests
    
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {failed_tests}")
    print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
    print()
    
    print("Detailed Results:")
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {test_name}: {status}")
    
    print("\n" + "=" * 60)
    
    if passed_tests == total_tests:
        print("🎉 ALL TESTS PASSED! Your Hugging Face MCP server is working perfectly!")
    elif passed_tests > total_tests / 2:
        print("⚠️  MOSTLY WORKING: Most features are functional, but some need attention.")
    else:
        print("🔧 NEEDS WORK: Several features are not working properly.")
    
    print("\nTroubleshooting Tips:")
    if not results.get("Basic MCP Integration", True):
        print("- Check your Cursor MCP configuration")
        print("- Verify the server.js path is correct")
        print("- Ensure the server starts without errors")
    
    if not results.get("Text Generation Inference", True):
        print("- Verify your HF_TOKEN is set in the MCP configuration")
        print("- Check that your token has the necessary permissions")
    
    print("\nFor more help, check the README.md file or Hugging Face documentation.")

def main():
    """Main test runner"""
    print_banner()
    
    # Test results storage
    results = {}
    
    # Run all tests
    tests = [
        ("Basic MCP Integration", test_basic_functionality),
        ("Model Search", test_model_search),
        ("Model Information", test_model_info),
        ("Dataset Search", test_dataset_search),
        ("Text Generation Inference", test_inference),
        ("Spaces Search", test_spaces_search),
        ("Error Handling", test_error_handling),
        ("Comprehensive Test", run_comprehensive_test),
    ]
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except KeyboardInterrupt:
            print("\n\nTest interrupted by user.")
            break
        except Exception as e:
            print_error(f"Test '{test_name}' encountered an error: {e}")
            results[test_name] = False
        
        if test_name != tests[-1][0]:  # Don't wait after the last test
            wait_for_user()
    
    # Generate report
    generate_test_report(results)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTest suite interrupted. Goodbye!")
        sys.exit(0)