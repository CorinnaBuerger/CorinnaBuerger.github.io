---
layout: post
title:  "Turtle-Paint"
date:   2020-05-09 22:52:00 +0200
categories: jekyll update
comments: true
---

In this post, I will introduce a drawing program **TurtlePaint**. It was created using the Turtle module of Python 3.8. 
It allows you to draw beautiful pictures by intuitively clicking on the screen, moving the turtle around with `h`, `j`, `k`, `l` or by simply dragging it with your mouse. Choose between different pencolors, fillcolors, pensizes and turtle shapes to get a perfect result! It is great for creating simple shapes or small drawings, but also to let your creativity run free!

When the program gets started, an instance of the class `TurtlePaint` gets created taking `settings` as an argument:

```python
if __name__ == "__main__":
    tpaint = TurtlePaint(settings)
    tpaint.mainloop()
```

Calling the mainloop method prevents our program from closing immediatly after execution.
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



