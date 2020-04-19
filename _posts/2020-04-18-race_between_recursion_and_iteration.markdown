---
layout: post
title:  "Race between Recursion and Iteration"
date:   2020-04-18 18:02:40 +0200
categories: jekyll update
comments: true
---


Today I will compare two methods for getting a certain Fibonacci number F<sub>n</sub>: Recursion and Iteration.
Both methods work fine but one of them is much faster than the other one.

# Iteration

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
For all other cases, we start at the first position F<sub>1</sub> and sum up the current position with the last one. We do this `n-1` times and then `return current`.
And that's all, we are done so far!

# Recursion

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

# Time it!

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

For this function we make use of the method `perf_counter` from the `time` package. It returns the time since the beginning in seconds as a float. This helps us measuring the time our function takes to be called a certain number of `times`.

Let's try it out!

{% highlight python %}
time_it(1, fib_iteration, 10)
time_it(1, fib_recursion, 10)

###############
# Output:

# 1.4540000000007325e-05
# 7.270099999999446e-05
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

We start with printing the headers of our three-columned table: `n`, `recursion` and `iteration`. For each number < n we now print the time the two functions take for returning the result.
At some point this takes really long, especially when using recursion, so we say: if the time `rec_time` or `it_time` reaches more than 20 seconds, for the next call we just print `"--- too long ---"`.

{% highlight python %}
table(fib_recursion, fib_iteration, 50)

###############
# Output:

#   n |      recursion |      iteration
# ----|----------------|---------------
#   1 |     0.00000642 |     0.00000342
#   2 |     0.00000855 |     0.00000513
#   3 |     0.00001197 |     0.00000556
#               ........
#  33 |     4.85348655 |     0.00003336
#  34 |     7.80146386 |     0.00003036
#  35 |    12.98958323 |     0.00002266
#  36 |    18.16303924 |     0.00002438
#  37 |    33.10127890 |     0.00003763
#  38 | ---too long--- |     0.00002053
#               ........
#  49 | ---too long--- |     0.00002395
#  50 | ---too long--- |     0.00002480
{% endhighlight %}


And again, we can see that recursion is way slower than iteration.
So if you want to get a certain number F<sub>n</sub>, I would highly recommend using iteration!

{% if page.comments %}

  <div id="disqus_thread"></div>
  <script>
    var disqus_config = function () {
      this.page.url = '{{ page.url | absolute_url }}';
      this.page.identifier = '{{ page.url | absolute_url }}';
    };

    (function() {
      var d = document, s = d.createElement('script');

      s.src = 'https://{{ site.disqus.shortname }}.disqus.com/embed.js';

      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();
  </script>
  <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
{% endif %}