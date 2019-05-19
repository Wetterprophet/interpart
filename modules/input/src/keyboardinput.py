import curses
from curses import wrapper

# num buttons starting from 1(=49), 2(=50), ...
KEY_MAP = {
    "1" : "de", 
    "2" : "en", 
    "3" : "fr", 
    "4" : "it", 
    "5" :  "es", 
    "6" : "ar", 
    #"7" : "fa", 
    "8" : "tr", 
    "9" : "el", 
    #"0" : "ps", 
    "q" : "ru", 
    "w" : "uk", 
    #"e" : "ro", 
    "r" : "pl" 
    #"t" : "ku"

}

class KeyGrabber: 

    def read(self):
        key = chr(wrapper(listenForKey))

        if key in KEY_MAP:
            return KEY_MAP[key]
        else:
            return None
        
def listenForKey(stdscr):
    # turn of echo
    curses.noecho()
    # do not require enter 
    curses.cbreak()
    stdscr.clear()

    #print keymap
    stdscr.addstr("# CHOOSE INPUT LANGUAGE\n\n")
    for key in KEY_MAP:
        stdscr.addstr("- Press key {} for language: {}\n\r".format(key, KEY_MAP[key]))

    c = stdscr.getch()
    
    # disable curses screen
    stdscr.keypad(False)
    curses.nocbreak()
    curses.echo()
    curses.endwin()

    return c
    
