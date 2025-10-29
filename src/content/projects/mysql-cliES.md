---
title: "Interfaz de Línea de Comandos para MySQL"
description: "Una herramienta de terminal que facilita la creación, eliminación y gestión de tablas y bases de datos MySQL."
pubDate: 2024-10-31
heroImage: '../../assets/images/project-mysql.png'
tags: ["CLI", "MySQL", "Python"]
author: "Valentino"
category: 'Showcase'
lang: "es"
---

### Lo que hice
- Una herramienta de línea de comandos que facilita la creación, eliminación y gestión de tablas y bases de datos MySQL.

```python
import typer
import mysql.connector
from mysql.connector import Error

connection = None
cursor = None
showdatabases = None

try:
    connection = mysql.connector.connect(
        host="localhost",
        user="visualstudio",
        password="user1",
    )
    
    if connection.is_connected():
        print("Successful connection with MySQL server")
        connection.close()

except Error as e:
    print(f"Error connecting to MySQL: {e}")

app = typer.Typer()
print("THIS IS MY FIRST CLI I MADE IT TO CONTROL MY MySQL DATABASE AND FOR TEST\nType --help to see the man page")

@app.command()
def CREATE_DATABASE():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="visualstudio",
            password="user1",
        )
        cursor = connection.cursor()
        database_name_user = input("Give me a name for the DB: ").lower().strip()
        cursor.execute(f"CREATE DATABASE {database_name_user}")
        print(f"Database '{database_name_user}' was successfully created")
        connection.commit()

    except Error as e:
        print(f"Error creating the database: {e}")

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("Connection closed")

@app.command()
def CREATE_TABLE():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="visualstudio",
            password="user1",
        )
        cursor = connection.cursor()
        print("These are the DBs: ")
        cursor.execute("SHOW DATABASES;")
        databases = cursor.fetchall()
        print(databases)
        
        db_in_use = input("Which DB do you wanna use: ").lower().strip()
        cursor.execute(f'USE {db_in_use};')

        table_name_user = input("Give me a name for the table: ").lower().strip()
        user_table_fields = input("Tell me the name for the first column: ").lower().strip()
        user_field_type = input("Tell me the type (int, varchar): ").lower().strip()
            
        if user_field_type not in ["varchar", "int"]:
            print("That's not a correct option")
            return
        
        if user_field_type == "varchar":
            cursor.execute(f"CREATE TABLE {table_name_user} ({user_table_fields} VARCHAR(100));")
        else:
            cursor.execute(f"CREATE TABLE {table_name_user} ({user_table_fields} INT);")

        connection.commit()
        print(f"Table '{table_name_user}' was successfully created")
             
    except Error as e:
        print(f"Error creating the table: {e}")

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("Connection closed")

@app.command()
def DROP_DATABASE():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="visualstudio",
            password="user1",
        )
        cursor = connection.cursor()
        print("These are the DBs: ")
        cursor.execute("SHOW DATABASES;")
        databases = cursor.fetchall()
        print(databases)

        db_to_delete = input("Which DB do you want to delete: ").lower().strip()
        cursor.execute(f"DROP DATABASE IF EXISTS {db_to_delete}")
        connection.commit()
        print(f"The database '{db_to_delete}' was successfully deleted")

    except Error as e:
        print(f"There was an error deleting the database: {e}")

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("Connection closed")

@app.command()
def DROP_TABLE():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="visualstudio",
            password="user1",
        )
        cursor = connection.cursor()
        print("These are the DBs: ")
        cursor.execute("SHOW DATABASES;")
        databases = cursor.fetchall()
        print(databases)

        db_table_delete = input("From which DB do you want to delete a table: ").lower().strip()
        cursor.execute(f"USE {db_table_delete};")

        print("These are the tables in this DB: ")
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()
        print(tables)

        table_to_delete = input("Which table do you want to delete: ").lower().strip()
        cursor.execute(f"DROP TABLE {table_to_delete};")
        connection.commit()
        print(f"The table '{table_to_delete}' was successfully deleted")

    except Error as e:
        print(f"There was an error deleting the table: {e}")

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("Connection closed")

@app.command()
def ALTER_TABLE():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="visualstudio",
            password="user1",
        )
        cursor = connection.cursor()
        print("These are the DBs: ")
        cursor.execute("SHOW DATABASES;")
        databases = cursor.fetchall()
        print(databases)

        db_table_to_modify = input("From which DB do you want to modify a table: ").lower().strip()
        cursor.execute(f"USE {db_table_to_modify};")

        print("These are the tables in this DB: ")
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()
        print(tables)

        table_to_modify = input("Which table do you want to modify: ").lower().strip()
        new_column = input("Tell me the name for the new column on this table: ").lower().strip()
        column_type = input("What type of column (varchar or int): ").lower().strip()
        
        if column_type not in ["varchar", "int"]:
            print("That's not a correct option")
            return
        
        if column_type == "varchar":
            cursor.execute(f"ALTER TABLE {table_to_modify} ADD {new_column} VARCHAR(100);")
        else:
            cursor.execute(f"ALTER TABLE {table_to_modify} ADD {new_column} INT;")

        connection.commit()
        print(f"New column '{new_column}' was successfully created")

    except Error as e:
        print(f"There was an error modifying the table: {e}")

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("Connection closed")

@app.command()
def INSERT_INTO():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="visualstudio",
            password="user1",
        )
        cursor = connection.cursor()
        print("These are the DBs: ")
        cursor.execute("SHOW DATABASES;")
        databases = cursor.fetchall()
        print(databases)

        db_table_to_introdata = input("In which DB do you want to introduce data: ").lower().strip()
        cursor.execute(f"USE {db_table_to_introdata};")

        print("These are the tables in this DB: ")
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()
        print(tables)

        table_to_introdata = input("In which table do you want to introduce data: ").lower().strip()
        print("These are the columns and their types: ")
        cursor.execute(f"DESCRIBE {table_to_introdata}")
        table_type_show = cursor.fetchall()
        print(table_type_show)
        
        while True:
            data = input("Introduce the data in this format [data1, data2] (or type 'exit' to stop): ").strip()
            if data.lower() == 'exit':
                break  
            
            data_to_intro = [d.strip() for d in data.split(',')]

            if len(data_to_intro) != len(table_type_show):
                print(f"Error: Expected {len(table_type_show)} values, but got {len(data_to_intro)}.")
                continue

            placeholders = ', '.join(['%s'] * len(data_to_intro))
            query = f"INSERT INTO {table_to_introdata} VALUES ({placeholders})"
            
            cursor.execute(query, data_to_intro)
            connection.commit()
            print("Data inserted successfully:", data_to_intro)
        
    except Error as e:
        print(f"There was an error introducing the data into the table: {e}")

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("Connection closed")

@app.command()
def MANPAGE():
    print("""HELLO FELLA, THIS IS THE MANUAL FOR THIS EXOTIC AND SEXY CLI
           
           COMMANDS
                - CREATE DATABASE
                    Create a database in the localhost MySQL server
                - CREATE TABLE
                    Create a table within a database in the localhost MySQL server
                - DROP DATABASE
                    Delete a database in the localhost MySQL server
                - DROP TABLE
                    Delete a table from a database in the localhost MySQL server
                - ALTER TABLE
                    Add new columns to a table of a database in the localhost MySQL server
                - INSERT INTO
                    Introduce data into a table of a database in the localhost MySQL server
                - --HELP
                    Show this screen
           """)

def main_loop():
    while True:
        userinput = input("> ").strip().upper()
        if userinput == "CREATE DATABASE":
            CREATE_DATABASE()
        elif userinput == "CREATE TABLE":
            CREATE_TABLE()
        elif userinput == "DROP DATABASE":
            DROP_DATABASE()
        elif userinput == "DROP TABLE":
            DROP_TABLE()
        elif userinput == "ALTER TABLE":
            ALTER_TABLE()
        elif userinput == "INSERT INTO":
            INSERT_INTO()
        elif userinput == "--HELP":
            MANPAGE()
        elif userinput == "EXIT": 
            print("Finishing the program...")
            break
        else:
            print("Unknown command. Try again.")

if __name__ == "__main__":
    main_loop()