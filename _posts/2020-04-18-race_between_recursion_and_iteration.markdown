---
layout: post
title:  "Race between Recursion and Iteration"
date:   2020-04-18 18:02:40 +0200
categories: jekyll update
---


Today I will compare two methods for getting a certain Fibonacci number F<sub>n</sub>: Recursion and Iteration.
Both methods work fine but one of them is much faster than the other one.

At first, let's take a look at the iterative function `fib_iteration(n)`:

{% highlight python %}
def fib_iteration(n):
    if n == 1:
        return 1
    else:
        current = 1
        last = 0
        next_num = 0
        for _ in range(n-1):
            next_num = current + last
            last = current
            current = next_num
        return current
{% endhighlight %}

The sequence starts with F<sub>1</sub> = 1, so for this case we can just `return 1` without calculating anything.
For all other cases, we start at the first position F<sub>1</sub> and sum up the current position with the last one. We do this n-1 times and then `return current`.
And that's all, we are done so far! 

So let's go on with the recursive function `fib_recursion(n)`:

{% highlight python %}
def fib_recursion(n):
    if n <= 2:
        return 1
    return fib_recursion(n-1) + fib_recursion(n-2)
{% endhighlight %}

We already know that both F<sub>1</sub> and F<sub>2</sub> = 1, so for these cases we can just `return 1`.
For all other cases we simply sum up the function calls for the two previous ones and `return` the result.

The recursive function surely is shorter and appears more elegant than the iterative one. But which one is faster?
For this, we create another function called `time_it` which takes three arguments: `times` for defining how often a certain function should be called, the `function`that should be tested and the `argument` the tested function should take.

{% highlight python %}
from time import perf_counter

def time_it(times, function, argument):
    start = perf_counter()
    for _ in range(times):
        function(argument)
    end = perf_counter()
    return end - start
{% endhighlight %}

For this function we take usage of the method `perf_counter` from the `time` package. It returns the time since the beginning in seconds as a float. This helps us measuring the time our function takes to be called `times` times.

Let's try it out!

{% highlight python %}
time_it(1, fib_iteration, 10)
time_it(1, fib_recursion, 10)

1.4540000000007325e-05
7.270099999999446e-05
{% endhighlight %}

As we can see, the iterative way seems to be faster than the recursive one!
Now let's compare our two methods more closely by printing a table containing the time both methods take to give us a certain number F<sub>n</sub>.

{% highlight python %}
def table(func1, func2, n):
    print("{:>4} | {:>14} | {:>14}".format("n", "recursion", "iteration"))
    print("-----|----------------|---------------")
    it_time = 0
    rec_time = 0
    case = "BOTH_FINE"
    for i in range(1, n+1):
        if rec_time < 20.0:
            rec_time = time_it(1, func1, i)
        else:
            case = "REC_TIME_TOO_LONG"
            
        if it_time < 20.0:
            it_time = time_it(1, func2, i)
        else:
            case = "BOTH_TOO_LONG"

        if case == "BOTH_FINE":
            print("{:>4} | {:>14.8f} | {:>14.8f}".format(i, rec_time, it_time))

        if case == "REC_TIME_TOO_LONG":
            print("{:>4} | ---too long--- | {:>14.8f}".format(i, it_time))

        if case == "BOTH_TOO_LONG":
            print("{:>4} | ---too long--- | ---too long---".format(i, rec_time, it_time))
{% endhighlight %}

We start with printing the headers of our three-columned table: n, recursion and iteration. For each number < n we now print the time the two functions take for returning the result.
At some point this takes really long, especially when using recursion, so we say: if the time `rec_time` or `it_time` reached more than 20 seconds, for the next call we just print `"--- too long ---"`.

{% highlight python %}
table(fib_recursion, fib_iteration, 50)

   n |      recursion |      iteration
-----|----------------|---------------
   1 |     0.00000642 |     0.00000342
   2 |     0.00000855 |     0.00000513
   3 |     0.00001197 |     0.00000556
   4 |     0.00001368 |     0.00000556
   5 |     0.00001582 |     0.00000599
   6 |     0.00001967 |     0.00000599
   7 |     0.00002523 |     0.00000642
   8 |     0.00003464 |     0.00000684
   9 |     0.00004875 |     0.00000684
  10 |     0.00007227 |     0.00000770
  11 |     0.00011076 |     0.00000727
  12 |     0.00017149 |     0.00000727
  13 |     0.00026429 |     0.00000770
  14 |     0.00039344 |     0.00000812
  15 |     0.00062865 |     0.00000855
  16 |     0.00117519 |     0.00001411
  17 |     0.00162465 |     0.00000984
  18 |     0.00261895 |     0.00000984
  19 |     0.00560910 |     0.00001882
  20 |     0.00915306 |     0.00001882
  21 |     0.01120536 |     0.00001197
  22 |     0.02042684 |     0.00001924
  23 |     0.04603170 |     0.00002138
  24 |     0.05596907 |     0.00002010
  25 |     0.08806057 |     0.00001967
  26 |     0.13994428 |     0.00002138
  27 |     0.24939305 |     0.00002181
  28 |     0.43397317 |     0.00002010
  29 |     0.62566174 |     0.00002138
  30 |     0.95699180 |     0.00002908
  31 |     1.67761430 |     0.00002309
  32 |     2.60626426 |     0.00002224
  33 |     4.85348655 |     0.00003336
  34 |     7.80146386 |     0.00003036
  35 |    12.98958323 |     0.00002266
  36 |    18.16303924 |     0.00002438
  37 |    33.10127890 |     0.00003763
  38 | ---too long--- |     0.00002053
  39 | ---too long--- |     0.00001967
  40 | ---too long--- |     0.00002053
  41 | ---too long--- |     0.00002095
  42 | ---too long--- |     0.00002053
  43 | ---too long--- |     0.00002138
  44 | ---too long--- |     0.00002138
  45 | ---too long--- |     0.00002224
  46 | ---too long--- |     0.00002267
  47 | ---too long--- |     0.00002266
  48 | ---too long--- |     0.00002352
  49 | ---too long--- |     0.00002395
  50 | ---too long--- |     0.00002480
{% endhighlight %}


And again, we can see that recursion is way slower than iteration.
So if you want to get a certain number F<sub>n</sub>, I would highly recommend using iteration!



[corinnabuerger-gh]:   https://github.com/corinnabuerger

