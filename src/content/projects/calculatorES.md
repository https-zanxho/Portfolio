---
title: "Calculadora simple"
description: "Una calculadora sencilla hecha en Python"
pubDate: 2024-10-31
heroImage: '../../assets/images/project-calc.png'
tags: ["Calculadora", "Python"]
author: "Valentino"
category: 'Showcase'
lang: "es"
---

### Lo que hice
- Una calculadora sencilla programada en Python que puede realizar operaciones básicas como suma, resta, multiplicación y división.

```python
import time

print ("this is a simple calculator (add, substract, multiply, division), tell me two numbers")

#ask the user for the numbers that we will use for the calculator and store it in that two variables
def req_nums ():
    while True:
        try:
            num = (float (input ("first number: ")))
            
            print("Valid number entered:", num)
            return num
        except ValueError:
            print("enter a valid number")

num1 = req_nums()
num2 = req_nums()
    
#ask if the numbers are okay and store the answer in a variable
def user_choice():
    while True:
        choice = input(
"""Are these numbers right?
> yes
> no
"""
        ).strip().lower()

        if choice in ["yes", "no"]:
            return choice
        else:
            print("Not valid, try again.")
            
#here the program check the answer
while True:
    try:
        user_answer = user_choice()
        if user_answer == "yes":
            print ("now that we have the numbers this are the results of al the basic operation with that numbers")
            print ("one second, we are calculating the results...")
            time.sleep(1)
            A = num1 + num2
            B = num1 - num2
            C = num1 * num2
            D = num1 / num2
            print (f"> {A}----> ADD")
            print (f"> {B}----> SUBSTRACTION")
            print (f"> {C}----> MULTIPLY")
            print (f"> {D}----> DIVISION")
            print ("SCIENTIFIC CALCULATOR-----> COMING SOON...")
            input ("                                       ...PRESS ANY KEY TO CLOSE THE PROGRAM...                        ")
            break
    #else it just ask u again for 2 new numbers
        elif user_answer == "no" :
            print ("well, tell me two numbers again")
            num1 = req_nums()
            num2 = req_nums()
    except ValueError:
        print("Not a valid number, try again")
    


    
