import curses
from curses import wrapper

# num buttons starting from 1(=49), 2(=50), ...
KEY_MAP = {
    "49" : "de",
    "50" : "en",
    "51" : "es",
    "52" : "it",
    "53" : "ar",
    "54" : "ro"
}

class KeyGrabber: 

    def read(self):
        key = wrapper(listenForKey)

        if str(key) in KEY_MAP:
            return KEY_MAP[str(key)]
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
        stdscr.addstr("- Press key {} for language: {}\n\r".format(int(key) - 48, KEY_MAP[key]))

    c = stdscr.getch()
    
    # disable curses screen
    stdscr.keypad(False)
    curses.nocbreak()
    curses.echo()
    curses.endwin()

    return c
    
