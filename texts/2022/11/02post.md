There was a small piece of code in the telegram example that I used. Ended up not needed, but it might me useful - understanding relative paths on AWS:

```
here = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.join(here, "./vendored"))
```
