#!/usr/bin/env python3
"""
Simple migration runner to execute SQL migrations on Supabase
"""
import sys
from supabase_client import supabase

def run_migration(sql_file_path: str):
    """Run SQL migration file"""
    try:
        print(f"Reading migration: {sql_file_path}")
        with open(sql_file_path, 'r') as f:
            sql = f.read()

        print("Executing migration...")
        # Use the rpc function to execute raw SQL
        # Note: This requires a database function to be set up, or we use postgREST directly

        # For Supabase, we need to run this via the SQL Editor in dashboard
        # Or use psycopg2 to connect directly
        # Let's try using the supabase client's postgrest

        # Split by semicolons and execute each statement
        statements = [s.strip() for s in sql.split(';') if s.strip() and not s.strip().startswith('--')]

        for i, statement in enumerate(statements):
            if statement:
                print(f"\nExecuting statement {i+1}/{len(statements)}...")
                print(f"Statement: {statement[:100]}...")
                # This won't work directly with supabase-py, need direct DB access
                print("Note: This migration needs to be run directly in Supabase SQL Editor")
                print(f"\nSQL to run:\n{statement};")

        print("\n" + "="*60)
        print("FULL MIGRATION SQL:")
        print("="*60)
        print(sql)
        print("="*60)
        print("\nPlease copy the above SQL and run it in your Supabase SQL Editor at:")
        print("https://supabase.com/dashboard/project/YOUR_PROJECT/editor")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python run_migration.py <migration_file.sql>")
        sys.exit(1)

    run_migration(sys.argv[1])
