A partial polyfill for the [Template Instantiation Proposal]()

## Usage

```
npm i -S template-instantiation-polyfill
```

```html
<template id="tpl">
  <article>
    <h2>Hi!, my name is {{ name }}</h2>
    <img src="{{ picture }}" role="presentation"/>
    <p>{{ shortBio }}</p>
  </article>
</template>

<button>Update</button>
```
```ts
import 'template-instantiation-polyfill';

const template =
  document.getElementById<HTMLTemplateElement>('tpl');

const handleAsJson =
  (x: Response) =>
    x.handleAsJson();

document.querySelector('button').addEventListener('click', async function() {
  const userId = new URLSearchParams(location.search).get('userId');
  const { name, picture, shortBio } = await fetch(`/users/${userId}`).then(handleAsJson);

  if (template.instance)
    template.instance.update({ name, picture, shortBio })
  else
    document.body.appendChild(template.createInstance({ name, picture, shortBio }))
});
```

## Acknowledgements

Must appreciation for [prior art](https://github.com/w3c/webcomponents/issues/702#issuecomment-442370775) by @Jamesernator.

Thanks to Ryosuke Niwa for championing the proposal.
