I want to be able to generate _reasonable_ visual layout snapshots. Because when we get bugs at Artsy, they tend to be layout driven regressions, on iOS this [was easy to handle](https://github.com/artsy/eigen/tree/master/Artsy_Tests/ReferenceImages) and we made a [few](https://cocoapods.org/pods/Expecta+Snapshots) [libraries](https://cocoapods.org/pods/Nimble-Snapshots) to make it feel good. 

Moving to React Native gave us the chance to have fast tests that are run out of process, this is really cool. However,  high level, pixel-accurate representations of the layouts can only be done on a simulator, meaning they can't be fast. So, this project aims to provide a *good enough* representation of a React Native tree of components that you can feel some security that making UI changes in one platform does not affect layouts in others.


<img src="https://cloud.githubusercontent.com/assets/49038/22830912/459acc64-ef76-11e6-8209-44b3291291a6.png">

---

This project came from this [original issue](https://github.com/artsy/emission/issues/442).
