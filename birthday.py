import random
import time
import os

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def typewriter(text, delay=0.03):
    for char in text:
        print(char, end='', flush=True)
        time.sleep(delay)
    print()

# ==================== QUESTIONS ====================
another_questions = [
    ("What would you prefer?", "Early Morning Vibes", "Midnight Vibes"),
    ("What would you prefer?", "Like to be Alone", "Like to be with people"),
    ("What would you prefer?", "Spending Summer on a beach", "Long ride on a bike at night"),
    ("What would you prefer?", "Cooking food alone", "Cooking with friends around a bonfire"),
    ("What would you prefer?", "Taking a walk alone at night", "Lying down looking at starry sky")
]

food_questions = [
    ("What is your favourite?", "Noodles", "Panipuri"),
    ("What is your favourite?", "Blackcurrant 🍨", "Vanilla 🍨"),
    ("What is your favourite?", "Spicy dishes", "Sweet dishes"),
    ("What is your favourite?", "Butterscotch Icecream", "Chocolate Icecream"),
    ("What is your favourite?", "Kitkat", "Dairy milk Hazelnut")
]

riddles = [
    ("I can hold moments forever, Yet I'm not alive. Open me and memories return. What am I?", "P_O_O A_B_M", "PHOTO ALBUM"),
    ("I follow you everywhere, But disappear in darkness. What am I?", "SH_D_W", "SHADOW"),
    ("I have keys but no locks, Space but no rooms, Once you enter you can only escape. What am I?", "K_Y B___D", "KEYBOARD")
]

# ==================== MAILBOX ANIMATION ====================
def mailbox_animation():
    clear_screen()
    print("\n" * 3)
    print(" " * 20 + "📬")
    time.sleep(1)
    print(" " * 18 + "✉️  " * 3)
    time.sleep(0.5)
    print("\n" * 2 + " " * 10 + "🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹")
    typewriter("\n✨ A letter flies out... ✨")
    time.sleep(1)

# ==================== QUIZ ====================
def run_quiz(questions, section_name):
    answers = []
    print(f"\n📝 {section_name} Section")
    for i, (q, opt1, opt2) in enumerate(questions, 1):
        clear_screen()
        print(f"\n📝 {section_name} Section - Question {i}/5")
        print(f"\n{q}")
        print(f"\n1. {opt1}")
        print(f"2. {opt2}")
        
        start = time.time()
        choice = input("\nYour choice (1 or 2): ").strip()
        elapsed = time.time() - start
        
        if elapsed > 10:
            print("\n⏰ Time's up! Moving to next question...")
            answers.append("No answer")
        elif choice == "1":
            answers.append(opt1)
            print(f"\n✅ You chose: {opt1}")
        elif choice == "2":
            answers.append(opt2)
            print(f"\n✅ You chose: {opt2}")
        else:
            answers.append("Invalid")
            print("\n❌ Invalid choice")
        
        time.sleep(1.5)
    return answers

# ==================== RIDDLES ====================
def run_riddles():
    correct_count = 0
    for i, (riddle, format_hint, answer) in enumerate(riddles, 1):
        clear_screen()
        print(f"\n🔐 Riddle {i}/3")
        print(f"\n{riddle}")
        print(f"\nFormat: {format_hint}")
        
        start = time.time()
        user_answer = input("\nYour answer: ").strip().upper()
        elapsed = time.time() - start
        
        if elapsed > 15:
            print("\n⏰ Time's up! You are so dumb 😂😂")
        elif user_answer == answer:
            print("\n✅ Smart!")
            correct_count += 1
        else:
            print(f"\n❌ Wrong answer! The answer was {answer}")
        
        time.sleep(2)
    return correct_count

# ==================== GIFT BOXES ====================
def gift_boxes(correct_count, food_choice):
    clear_screen()
    print("\n🎁 Gift Boxes 🎈")
    print("\n7 balloons with gift boxes appear...")
    print("You open them one by one...")
    
    messages = [
        f"✨ You have answered {correct_count} questions correctly. ✨",
        f"🍫 I will send you 5 {food_choice} 🍫 for each correct question.",
        "🤓 You are damn smart 🤓" if correct_count == 3 else "😂 But still, you are too slow 😂😂"
    ]
    
    input("\nPress Enter to open the first gift...")
    print(f"\n🎁 {messages[0]}")
    
    input("\nPress Enter to open the second gift...")
    print(f"\n🎁 {messages[1]}")
    
    input("\nPress Enter to open the third gift...")
    print(f"\n🎁 {messages[2]}")
    
    return messages[2] if correct_count == 3 else messages[2]

# ==================== NO CONTEXT MESSAGES ====================
no_context_messages = [
    "Wait a minute.....", "Did I forget something.....", "Give me a moment.....",
    "Is it Your Birthday 🎂 today.....", "Really.....", "Sorry I didn't wish you earlier....."
]

def no_context_sequence():
    clear_screen()
    print("\n🤔")
    for msg in no_context_messages:
        input(f"\n{msg} (Press Enter)")
    clear_screen()

# ==================== PUZZLE (Text-based) ====================
def show_puzzle():
    clear_screen()
    print("\n🧩 16-Piece PUZZLE 🧩")
    print("\nYour photo of Shweta is cut into 16 pieces!")
    print("You need to arrange them in order.")
    print("\nPieces are shuffled. Solve by typing numbers 1-16 to swap with empty space.\n")
    
    # Create shuffled puzzle (16 pieces)
    pieces = list(range(1, 17))
    random.shuffle(pieces)
    empty_index = pieces.index(16)
    
    moves = 0
    
    def display_puzzle():
        print("\n" + "-" * 30)
        for i in range(0, 16, 4):
            row = pieces[i:i+4]
            print("|", end=" ")
            for p in row:
                if p == 16:
                    print("⬜", end="  | ")
                else:
                    print(f"{p:2}", end=" | ")
            print()
        print("-" * 30)
    
    while pieces != list(range(1, 17)):
        display_puzzle()
        print(f"\nMoves: {moves}")
        
        try:
            choice = int(input("\nEnter number to move into empty space (1-16): "))
            if choice < 1 or choice > 16:
                print("Invalid! Enter 1-16")
                continue
            
            choice_index = pieces.index(choice)
            empty_index = pieces.index(16)
            
            # Check if adjacent
            choice_row, choice_col = divmod(choice_index, 4)
            empty_row, empty_col = divmod(empty_index, 4)
            
            if abs(choice_row - empty_row) + abs(choice_col - empty_col) == 1:
                pieces[choice_index], pieces[empty_index] = pieces[empty_index], pieces[choice_index]
                moves += 1
                print("\n✅ Piece moved!")
            else:
                print("\n❌ Not adjacent to empty space!")
        
        except ValueError:
            print("Enter a valid number!")
    
    display_puzzle()
    print(f"\n🎉 Puzzle solved in {moves} moves! 🎉")
    input("\nPress Enter to continue...")

# ==================== CAKE ANIMATION ====================
def cake_animation():
    clear_screen()
    print("\n🎂 THE FINAL SURPRISE 🎂")
    print("\nA 3-layer chocolate cake falls from the sky...\n")
    
    layers = ["🍫 Layer 1", "🍫🍫 Layer 2", "🍫🍫🍫 Layer 3"]
    for layer in layers:
        print(f"  {layer}")
        time.sleep(1)
    
    print("\n✨ The cake lands perfectly! ✨")
    time.sleep(1)
    
    candles = ["🕯️", "🕯️🕯️", "🕯️🕯️🕯️"]
    for candle in candles:
        print(f"  {candle}")
        time.sleep(0.5)
    
    print("\n" + "=" * 50)
    print("🎂 HAPPY BIRTHDAY 🎂 Shwetaaaaaa Sister! 🎂")
    print("=" * 50)

# ==================== MAIN ====================
def main():
    clear_screen()
    print("=" * 50)
    print("🎂 BIRTHDAY SURPRISE 🎂")
    print("=" * 50)
    
    name = input("\nEnter your name: ").strip()
    if name.lower() != "shweta":
        print(f"\nWelcome {name}, but this surprise is for Shweta only!")
        print("Goodbye!")
        return
    
    print(f"\n✨ Welcome {name}! ✨")
    time.sleep(1)
    
    # Mailbox
    mailbox_animation()
    input("\nPress Enter to continue...")
    
    # Quote
    clear_screen()
    print("\n✨ A Little Something ✨")
    print('\n"Like stars that shine brightest in the darkest night,')
    print('you have your own ways to make things beautiful."')
    input("\nPress Enter to continue...")
    
    # Another Type Quiz
    another_answers = run_quiz(another_questions, "Another Type")
    
    # Food Quiz
    food_answers = run_quiz(food_questions, "Food")
    food_choice = food_answers[4] if len(food_answers) > 4 else "Kitkat"
    
    # Personalized Message
    clear_screen()
    print(f"\n💬 I know you have chosen {food_choice}.")
    input("\nPress Enter to continue...")
    
    # Challenge Page
    clear_screen()
    print(f"\n🎯 CHALLENGE 🎯")
    print(f"\nI have a challenge for you. If you answer correctly,")
    print(f"I will send you 5 {food_choice} 🍫 for each correct answer.")
    input("\nPress Enter to begin the riddles...")
    
    # Riddles
    correct_count = run_riddles()
    
    # Gift Boxes
    gift_result = gift_boxes(correct_count, food_choice)
    input("\nPress Enter to continue...")
    
    # Final Quote
    clear_screen()
    print("\n✨ A FINAL WISH ✨")
    print('\n"Wherever life takes you, always remember:')
    print('you are loved, you are enough,')
    print('and you are a beautiful soul."')
    input("\nPress Enter to continue...")
    
    # No Context Messages
    no_context_sequence()
    
    # Huge Gift Box
    clear_screen()
    print("\n🎁 A HUGE GIFT BOX 🎁")
    input("\nPress Enter to open it...")
    print("\n🎁🎈 The box opens to reveal... A PUZZLE! 🎁🎈")
    input("\nPress Enter to continue...")
    
    # Puzzle
    show_puzzle()
    
    # Cake Animation
    cake_animation()
    
    print("\n🎉 Thank you for completing the journey! 🎉")
    print(f"Happy Birthday {name}! 🎂🎈✨")

if __name__ == "__main__":
    main()
  
