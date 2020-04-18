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
   0 |     0.00000599 |     0.00000599
   1 |     0.00000812 |     0.00000299
   2 |     0.00000812 |     0.00000556
   3 |     0.00001197 |     0.00000513
   4 |     0.00001368 |     0.00000556
   5 |     0.00001668 |     0.00000556
   6 |     0.00002694 |     0.00000813
   7 |     0.00002651 |     0.00000599
   8 |     0.00003635 |     0.00000684
   9 |     0.00005260 |     0.00000684
  10 |     0.00007740 |     0.00000770
  11 |     0.00011846 |     0.00000727
  12 |     0.00018389 |     0.00000770
  13 |     0.00027669 |     0.00000770
  14 |     0.00039258 |     0.00000855
  15 |     0.00062865 |     0.00000898
  16 |     0.00107384 |     0.00000984
  17 |     0.00166143 |     0.00001197
  18 |     0.00266770 |     0.00001112
  19 |     0.00428893 |     0.00001069
  20 |     0.00978341 |     0.00002566
  21 |     0.01249687 |     0.00001711
  22 |     0.02249625 |     0.00003036
  23 |     0.04679292 |     0.00004063
  24 |     0.06726424 |     0.00002994
  25 |     0.09583530 |     0.00002053
  26 |     0.14899512 |     0.00002010
  27 |     0.23792768 |     0.00001967
  28 |     0.36674443 |     0.00001967
  29 |     0.62779444 |     0.00002096
  30 |     0.99474586 |     0.00002224
  31 |     2.10873502 |     0.00004704
  32 |     3.11353928 |     0.00002138
  33 |     4.35561305 |     0.00002224
  34 |     6.65770363 |     0.00002138
  35 |    10.96801883 |     0.00002224
  36 |    17.20338829 |     0.00007698
  37 |    27.53783381 |     0.00003207
  38 | ---too long--- |     0.00002096
  39 | ---too long--- |     0.00002053
  40 | ---too long--- |     0.00002053
  41 | ---too long--- |     0.00002053
  42 | ---too long--- |     0.00002053
  43 | ---too long--- |     0.00002095
  44 | ---too long--- |     0.00002138
  45 | ---too long--- |     0.00002224
  46 | ---too long--- |     0.00002438
  47 | ---too long--- |     0.00003378
  48 | ---too long--- |     0.00002523
  49 | ---too long--- |     0.00001967

C:\Users\Corinna\Documents\python_coding>python fibonacci.py
50
   n |      recursion |      iteration
-----|----------------|---------------
   0 |     0.00000599 |     0.00000556
   1 |     0.00000812 |     0.00000299
   2 |     0.00000812 |     0.00000513
   3 |     0.00001198 |     0.00000513
   4 |     0.00001326 |     0.00000556
   5 |     0.00001582 |     0.00000599
   6 |     0.00001454 |     0.00000470
   7 |     0.00001967 |     0.00000513
   8 |     0.00003464 |     0.00000684
   9 |     0.00004875 |     0.00000684
  10 |     0.00007227 |     0.00000727
  11 |     0.00010991 |     0.00000684
  12 |     0.00017106 |     0.00000770
  13 |     0.00026472 |     0.00000770
  14 |     0.00045844 |     0.00001368
  15 |     0.00066543 |     0.00000898
  16 |     0.00101097 |     0.00000941
  17 |     0.00162807 |     0.00000941
  18 |     0.00262365 |     0.00000941
  19 |     0.00423419 |     0.00000984
  20 |     0.01004214 |     0.00001839
  21 |     0.01162874 |     0.00001967
  22 |     0.02566260 |     0.00002010
  23 |     0.03939025 |     0.00002010
  24 |     0.05425461 |     0.00003036
  25 |     0.09036990 |     0.00001967
  26 |     0.14145261 |     0.00002010
  27 |     0.22289140 |     0.00002010
  28 |     0.35605311 |     0.00002053
  29 |     0.57846084 |     0.00002053
  30 |     1.02315740 |     0.00002138
  31 |     1.61805764 |     0.00002138
  32 |     3.08622209 |     0.00002096
  33 |     4.28791132 |     0.00002181
  34 |     6.98115847 |     0.00002309
  35 |    11.58401305 |     0.00002224
  36 |    17.14486571 |     0.00002865
  37 |    29.68712829 |     0.00003165
  38 | ---too long--- |     0.00002010
  39 | ---too long--- |     0.00002010
  40 | ---too long--- |     0.00002053
  41 | ---too long--- |     0.00002053
  42 | ---too long--- |     0.00002095
  43 | ---too long--- |     0.00002053
  44 | ---too long--- |     0.00002138
  45 | ---too long--- |     0.00002181
  46 | ---too long--- |     0.00002224
  47 | ---too long--- |     0.00002309
  48 | ---too long--- |     0.00002309
  49 | ---too long--- |     0.00002352

C:\Users\Corinna\Documents\python_coding>python fibonacci.py
50
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



[jekyll-gh]:   https://github.com/corinnabuerger

