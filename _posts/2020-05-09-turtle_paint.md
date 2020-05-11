---
layout: post
title:  "Turtle-Paint"
date:   2020-05-09 22:52:00 +0200
categories: jekyll update
comments: true
---

In this post, I will introduce the drawing program **TurtlePaint**. It was created using the Turtle module of Python 3.8. 
It allows you to draw beautiful pictures by intuitively clicking on the screen, moving the turtle around with `h`, `j`, `k`, `l` or by simply dragging it with your mouse. Choose between different pencolors, fillcolors, pensizes and turtle shapes to get a perfect result! It is great for creating simple shapes or small drawings, but also to let your creativity run free!

When the program gets started, an instance of the class `TurtlePaint` gets created taking `settings` as an argument:

```python
if __name__ == "__main__":
    tpaint = TurtlePaint(settings)
    tpaint.mainloop()
```

Calling the `mainloop` method prevents our program from closing immediatly after execution.
Passing the settings as an arguments allows us to specify things like e.g. the maximal pensize or the position of the volume bar indexing our current pensize. Since the settings are not part of the class, they must be specified before instantiating TurtlePaint. In our program, the following settings are used:

```python
settings = {
    "start_volume_bar": (80, 280),
    "start_penup": (0, 300),
    "start_pendown": (0, 280),
    "max_pensize": 21,
    "pensize_stepsize": 2,
    "title": "Turtle Paint v0.0.2",
    "screen_dims": (800, 600),
}
```
This gets us the following result:

![Starting TurtlePaint]({{ corinnabuerger.github.io }}/assets/start.PNG)

Now let's take a look at how the toolbar at the top gets created. For this we used some hidden "helper turtles". By disabling the `tracer` (`Screen.tracer(False)`) their drawings are shown immediatly after starting the program without displaying it step by step like usual. They get instantiated in the constructor of the TurtlePaint class.

```python
class TurtlePaint():
    def __init__(self, settings):
        self.t1 = Turtle()  # main turtle
        self.t2 = Turtle()  # draws color bar
        self.t3 = Turtle()  # selects current color
        self.t4 = Turtle()  # draws tool bar border
        self.t5 = Turtle()  # makes shape stamps
        self.t6 = Turtle()  # selects current shape
        self.t7 = Turtle()  # refers to instructions
        self.t8 = Turtle()  # selects current fillcolor

        ...
```
After the toolbar is created, some of these turtles are not needed anymore and just stay ---hidden --- at the position where they finished their painting. Whereas other, the "selector turtles" need to refresh their drawing everytime the user makes some changes, like for example choosing a different pencolor. These dynamic conditions are easily solved by using the `clear` method, that clears everything a certain turtle has drawn so far. Now it can jump to the next area for selection. Since for all these steps `tracer` is disabled, it happens without any delay.

For two objects of the toolbar, namely the string toggler and the volume bar, we wrote additional classes. This allows us to also use them outside of TurtlePaint. So if we need a volume bar or want to toggle between two states in another program, we can simply import them. 

At first, I will show you the constructor of our string toggler. 

```python
class StringToggler():
    def __init__(self, pos_first, pos_second, str_1, str_2, screen):
        self.write_turtle = Turtle()
        self.non_active_color = "light gray"
        self.active_color = "black"
        self.active_str = (str_1, pos_first)
        self.passive_str = (str_2, pos_second)
        self.font = 'Courier', 10, 'italic'
        self.write_turtle.hideturtle()
        self.s = screen
        self.write()
```
You can simply create an instance of StringToggler by passing it two strings, between which you want to toggle, and the positions on the screen, where they should be displayed. 

```python
self.toggler = StringToggler(settings.get("start_pendown"),
                             settings.get("start_penup"),
                             "pen down", "pen up", self.s)
```

The class has two methods: `self.write` and `self.toggle`. `self.write` displays the active string in black and the passive one in light gray. Since we call it in the constructor, this will automatically happen after you create an instance of this class. In this case `str_1` will be the active string. `self.toggle` simply switches the active and the passive string and calls `self.write` again in order to update the display.

```python
def toggle(self):
    # toggle strings
    self.active_str, self.passive_str = self.passive_str, self.active_str
    self.write()
```

In our program, `self.toggler.toggle()` gets called everytime the user puts the pen up or down.

Now let's take a look at the constructor of our volume bar:

```python
class VolumeBar():
    def __init__(self, pos, maximum, screen):
        self.bar = Turtle()
        self.fill = Turtle()
        self.bar_hypo = 100
        self.pencolor = "black"
        self.pensize = 1
        self.pos = pos
        self.maximum = maximum
        self.s = screen
```
It instantiates two turtles: one for drawing the static border of our bar and one to dynamically fill it everytime the measurand changes. Like with the "selector turtles" mentioned above, we simply clear everything the "filling turtle" has drawn so far and refill the volume bar.
For our TurtlePaint, the pensize volume bar gets instantiated in the class constructor.

```python
class TurtlePaint():
...

self.v = VolumeBar(settings.get("start_volume_bar"),
                           settings.get("max_pensize"), self.s)
...
```

`"start_volume_bar"` and `"max_pensize"` are defined in the settings, which were already shown above. `self.s` is an instance of `turtle.Screen()`, which is a subclass of TurtleScreen. It is created in the class constructor as well. The screen is needed to call methods like for example `onkey` or `ondrag`, which will be used further below, but also for disabling the tracer like we already did in the beginning.

The picture below shows how it looks like, when we choose a lightblue pencolor with a pink fillcolor, a turtle shape and have increased the pensize.

![Changing pencolor, fillcolor, shape and pensize]({{ corinnabuerger.github.io }}/assets/selections.PNG)

Now that we looked at how all these user made changes are displayed in the toolbar, I will show you how the user can actually make all these changes!
For handling user input, we wrote a method `register_callbacks`, which is called right in the beginning.

```python
def register_callbacks(self):
    self.t1.onclick(self.t1.goto, 1)
    self.s.onscreenclick(self.go_to, 1)
    self.t1.ondrag(self.go_to, 1)
    self.s.onkey(self.pen_change, "p")
    self.s.onkey(self.change_color, "space")
    self.s.onkey(self.change_shape, "t")
    self.s.onkey(self.increase_pensize, "Up")
    self.s.onkey(self.decrease_pensize, "Down")
    self.s.onkey(self.screen_exit_handler, "Escape")
    self.s.onkey(self.screen_save_handler, "s")
    self.s.onkey(self.t1.begin_fill, "b")
    self.s.onkey(self.t1.end_fill, "e")
    self.s.onkey(self.change_fillcolor, "f")
    self.s.onkey(self.clear_all, "c")
    self.s.onkeypress(self.undo_drawings, "u")
    self.s.onkeypress(self.move_down, "j")
    self.s.onkeypress(self.move_up, "k")
    self.s.onkeypress(self.turn_left, "h")
    self.s.onkeypress(self.turn_right, "l")
    self.s.onkey(self.show_instructions, "?")
    self.s.listen()
```

Although the methods that are used above are slightly different, they all work in a very similar way: as a first argument, they take the function that shall be called when a certain key, which is specified in the second argument, gets pressed/released.

`onclick`: The turtle will go to the clicked position on the turtle itself (so it just moves slightly away from its current center). `1` as a second argument represents the left mouse key.

`onscreenclick`: The turtle will go to the clicked position on the screen.

`ondrag`: After pressing the left mouse key down while the cursor is being on the turtle, it will follow your mouse movements until you release the click.

`onkey`: The specified function will be called --- once --- right after you pressed down a certain key.

`onkeypress`: The specified function will be called right after you pressed down a certain key and will be called over and over again as long as the key is down.

By clicking `?` you can open an additional window showing all the possible instructions.

![Instructions]({{ corinnabuerger.github.io }}/assets/instructions.PNG)


