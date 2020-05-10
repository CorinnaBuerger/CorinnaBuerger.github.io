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

Now let's take a look at how the toolbar at the top gets created. For this we used some hidden "helper turtles". By disabling the `tracer` their paintings are shown immediatly after starting the program without displaying it step by step like usual. They get instantiated in the constructor of the TurtlePaint Class.

```python
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
After drawing the toolbar, some of these turtles are not needed anymore and just stay ---hidden --- at the position where they finished their painting. But some, the "selector turtles" need to refresh their drawing everytime the user changes like for example the pencolor. These dynamic conditions are easily solved by using the `clear` method, that clears everything a certain turtle has drawn so far. No it can jump for example to the next color for selection. Since for all these steps `tracer` is disabled, it happens without any delay.

For two objects of the toolbar, namely the volume bar and the string toggler, we wrote additional classes. This allows us to also use them outside of TurtlePaint. So if we need a volume bar or want to toggle between two states in another program, we can simply import them. 

Let's take a look at the constructor of our volume bar:

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
It instatiates two turtles: one for drawing the static border of our bar and one to dynamically fill it everytime the measurand changes. Like with the "selector turtles" mentioned above, we simply clear everything the "filling turtle" has drawn and refill the volume bar.
For our TurtlePaint, the pensize volume bar gets instantiated in the class constructor.

```python
self.v = VolumeBar(settings.get("start_volume_bar"),
                           settings.get("max_pensize"), self.s)
```

`"start_volume_bar"` and `"max_pensize"` are defined in the settings, which were already shown above. `self.s` is an instance of `turtle.Screen()`, which is a subclass of TurtleScreen. It is created in the class constructor as well. The screen is needed to call methods like for example `onkey` or `ondrag`, which will be used further below, but also for disabling the tracer like we already did.

The picture below shows how it looks like, when we choose a lightblue pencolor with a pink fillcolor, a turtle shape and increased the pensize.

![Changing pencolor, fillcolor, shape and pensize]({{ corinnabuerger.github.io }}/assets/selections.PNG)
