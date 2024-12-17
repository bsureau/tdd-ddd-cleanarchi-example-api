.PHONY: help

help:
	@echo "⚙️ Availables commands :"
	@grep -E '^[a-zA-Z0-9_-]+:.*##' Makefile | awk 'BEGIN {FS = ":.*?## "} {printf "  %-15s %s\n", $$1, $$2}'

install: ## Install dependencies 📦
	@echo "⚙️ Installing dependencies..."
	npm install
	@echo "✅ Done!\n\n"

start: ## Start the project 🚀
	@echo "⚙️ Starting the project..."
	npm run start:dev
	@echo "✅ Done!\n\n"

prettier: ## Run Prettier 💅
	@echo "⚙️ Running Prettier..."
	npm run prettier . --write
	@echo "✅ Done!\n\n"

lint: ## Run ESLint 👀
	@echo "⚙️ Lint code..."
	npm run lint
	@echo "✅ Done!\n\n"

code-analysis: prettier lint ## Run code analysis 🕵️‍♂️

tests: ## Run tests ✅
	@echo "⚙️ Running tests"
	npm run test
	@echo "✅ Done!\n\n"
