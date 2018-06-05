+++
title = "Projects"
type = "projects"

+++

#### Here are some of the projects I've worked on.

{{< projects >}}
  <h3 class="tab-header" >Choose a path:</h3>

  <div class="tab">
    <button class="tab-links" onclick="openProject(event, 'code')"><img src="/images/coding.png" />Code</button>
    <button class="tab-links" onclick="openProject(event, 'design')"><img src="/images/ux-design.png" /> Design</button>
  </div>

  <div id="code" class="tab-content">
  <div class="project-container">
    <div class="code-projects">
      {{< code src="http://bit.ly/2mAEXW2" name="orinamiolatunji.com" url="https://orinamiolatunji.com" description="orinamiolatunji.com website" github="http://github.com/codediger" >}}
       {{< code src="/images/no-image.png" name="paystack.com" url="https://codediger.github.io/paystack.com/" description="An unsolicited paystack.com redesign and rebuild." github="https://github.com/codediger/paystack.com" >}}
    </div>
  </div>
  </div>

  <div id="design" class="tab-content">
      {{< design src="http://bit.ly/2mAEXW2" url="http://bit.ly/2DE58Dv"  description="orinamiolatunji.com website design" >}}
      {{< design src="http://bit.ly/2mO13W1" url="http://bit.ly/2DDPR5r" description="A Portfolio design for Sandra Israel-Ovirih." >}}
      {{< design src="/images/no-image.png" url="http://bit.ly/2FJ8Dcy" description="An unsolicited paystack.com redesign." >}}
  </div>

{{</ projects >}}