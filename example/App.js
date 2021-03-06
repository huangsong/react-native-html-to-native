import React from 'react';
import {StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {HTMLView} from '@busfor/react-native-html-to-native';

export default () => (
  <SafeAreaView>
    <HTMLView
      onLinkPress={(url) => console.log(url)}
      onError={(err) => console.log(err)}
      styles={styles}
      renderers={{
        'a.link': (node, renderChildren, style, props) => (
          <TouchableOpacity
            key={node.selectors[0]}
            onPress={() => console.log('Clicked', props.attributes.href)}
            style={style}>
            {renderChildren(node.children)}
          </TouchableOpacity>
        ),
      }}
      html={html}
    />
  </SafeAreaView>
);

const html =
  '<div><p>Paragraph</p></div><a class="link" href="Test">Link</a><img src="https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg" /><p>Test Test  Test Test Test Test Test Test Test <a>Link</a> in text text</p><a>Default link</a><p>Text before list<ul><li>Item</li><li>Item 2</li></ul></p><table><thead><tr><th>1</th><th>2</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr><tr><td>1</td><td>2</td></tr></tbody></table><ol><li>Item</li><li>Item</li><li>Item<ol><li>Item</li><li>Item</li></ol></li></ol>';

const styles = StyleSheet.create({
  'a.link': {
    padding: 8,
  },
  'a>TextNode': {
    color: 'green',
    fontSize: 16,
  },
  img: {
    width: 300,
    height: 200,
  },
  'p>TextNode': {
    fontSize: 16,
  },
  'li>TextNode': {
    color: 'red',
  },
  li: {
    marginVertical: 4,
    marginLeft: 4,
  },
});
