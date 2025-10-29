---
title: "Generador de Contraseñas Seguras"
description: "Un programa liviano que genera contraseñas fuertes y aleatorias con longitud variable según las preferencias del usuario."
pubDate: 2024-10-31
heroImage: '../../assets/images/project-password.png'
tags: ["CLI", "Python", "Seguridad"]
author: "Valentino"
category: 'Showcase'
lang: "es"
---

### Lo que hice
- Un programa liviano que genera contraseñas fuertes, totalmente aleatorias, y con una longitud configurable según las preferencias del usuario.

```python
import secrets
import string
import time

password_lenght = 0
password_dictionary = {}

password_symbols = string.ascii_letters + string.digits + string.punctuation 

while True:
    name_or_url_for_password = input("Please provide the URL for the password(cant be empty): ").strip()
    if name_or_url_for_password:
        break
    print("The URL or name cannot be empty.")


while True:
    try:
        password_lenght = int(input("Introduce the lenght of the password(8-100): "))
        if password_lenght > 100 or password_lenght < 8:
            print("select a valid lenght")
        else:
            print(f"Lenght set to {password_lenght}")
            break
    except ValueError:
        print("Please introduce a valid number")
time.sleep(1)

secure_password = ''.join(secrets.choice(password_symbols) for i in range(password_lenght))

password_dictionary[name_or_url_for_password] = secure_password

print("The password is being generated please wait...")
time.sleep(3)
print(f"the secure password is: {secure_password}")

print(password_dictionary)

input("\nPress any key to close the program...")
