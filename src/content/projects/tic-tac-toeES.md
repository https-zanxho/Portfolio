---
title: "Proyecto Final – Cisco NetAcad"
description: "Juego de Tic-Tac-Toe desarrollado en Python con un bot automático como oponente, creado como proyecto final del curso Cisco NetAcad."
pubDate: 2025-09-14
heroImage: '../../assets/images/project-cisco.png'
tags: ["Python", "Cisco", "Juego"]
author: "Valentino"
category: 'Showcase'
lang: "es"
---

### Lo que hice
- Un juego de Tic-Tac-Toe (tres en línea) desarrollado en Python que incluye un bot como oponente automático. Proyecto final del curso Cisco NetAcad.

### Resultados
- Juego completamente funcional programado en Python como entrega final del curso “Python Beginners” de Cisco NetAcad.
```python
import time
import random

boardtictactoe = [["1", "2", "3"],
         
                  ["4", "5", "6"],
         
                  ["7", "8", "9"]]


def userletter():
    global usrletter
    usrletter = str(input('which letter do you want to be O or X: ')).upper()
    while usrletter not in ['X', 'O']: 
        print('select a valid Letter(x or o): ')
        usrletter = str(input('which letter do you want to be O or X: ')).upper()
        
        
def display_board(board):
    for row in range(3):
        print("+-------+-------+-------+")
        print("|       |       |       |")
        print(f"|   {board[row][0]}   |   {board[row][1]}   |   {board[row][2]}   |")
        print("|       |       |       |")
        print("+-------+-------+-------+")


def enter_move(board): 
    while True:
        try:
            usermove = int(input("enter your move (between 1-9): "))
            break
        except ValueError:
            print("Please enter a valid number between 1-9.")
            

    while usermove not in range(1, 10):
        print('PLEASE SELECT A VALID FIELD')
        usermove = int(input('enter your move (between 1-9): '))

    row = (usermove - 1) // 3
    col = (usermove - 1) % 3
    
    while board[row][col] in ["X", "O"]:
        print("Please select a free field.")
        usermove = int(input('enter your move (between 1-9): '))
        row = (usermove - 1) // 3
        col = (usermove - 1) % 3
    board[row][col] = usrletter
    

def make_list_of_free_fields(board):
    global freefieldlist
    freefieldlist = []
    count = 0
    for rows in range(0, 3):
        for cols in range(0,3):
            if board[rows][cols] not in ["X", "O"]:
                freefieldlist.append([rows, cols])
            else:
                count += 1
    freefields = 9 - count
    print('there are', freefields,"free fields left in the board")
    for r, c in freefieldlist:
        print('the free fields are: ', boardtictactoe[r][c])


def victory_for(board, sign):
    for row in range(3):
        if board[row][0] == sign and board[row][1] == sign and board[row][2] == sign:
            print(f'The winner is the letter {sign}')
            return True
        
    for col in range(3):
        if board[0][col] == sign and board[1][col] == sign and board[2][col] == sign:
            print(f'The winner is the letter {sign}')
            return True
        
    if board[0][0] == sign and board[1][1] == sign and board[2][2] == sign:
            print(f'The winner is the letter {sign}')
            return True
    if board[0][2] == sign and board[1][1] == sign and board[2][0] == sign:
            print(f'The winner is the letter {sign}')
            return True
        
    return False

def draw_move(board):
    global machineletter
    if usrletter == 'X':
        machineletter = 'O'
    else:
        machineletter = 'X'
    board[1][1] = machineletter
    

def randommachinemove(board):
    rs, cl = random.choice(freefieldlist)
    board[rs][cl] = machineletter
def game():
    print('THE GAME STARTS...')
    userletter()
    time.sleep(1)
    print('MACHINE TURN...')
    draw_move(boardtictactoe)
    display_board(boardtictactoe)
    time.sleep(1)
    while not (victory_for(boardtictactoe, 'X') or victory_for(boardtictactoe, 'O')):
        print('USER TURN...')
        time.sleep(1)
        display_board(boardtictactoe)
        make_list_of_free_fields(boardtictactoe)
        enter_move(boardtictactoe)
        if victory_for(boardtictactoe, 'X') or victory_for(boardtictactoe, 'O'):
            display_board(boardtictactoe)
            break
        if not freefieldlist:
            print("It's a draw!")
            break
        time.sleep(1)
        print('MACHINE TURN...')
        time.sleep(1)
        display_board(boardtictactoe)
        make_list_of_free_fields(boardtictactoe)
        randommachinemove(boardtictactoe)
        time.sleep(1)
        if not freefieldlist:
            print("It's a draw!")
            break


if __name__ == "__main__":
    game()
