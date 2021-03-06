import React, { Fragment, ReactNode, memo, useState, useEffect, useCallback, useMemo } from 'react'
import { Linking } from 'react-native'

import type { HTMLRendererProps, ElementRenderer, NodeStyle, ElementProps, Node } from './types'
import { htmlToElement } from './utils'
import Defaults from './defaults'

const HTMLRenderer = memo(
  ({ html, renderers, styles, passProps, onError, onLinkPress, parserOptions }: HTMLRendererProps) => {
    const [parsedHtml, setParsedHtml] = useState<Node[] | null>(null)

    const getRenderer = useCallback(
      (selectors: string[]): ElementRenderer | null => {
        if (renderers) {
          for (let i = 0, selector; (selector = selectors[i]); i++) {
            if (renderers[selector]) {
              return renderers[selector]
            }
          }
        }
        return Defaults.renderers[selectors[selectors.length - 1]]
      },
      [renderers]
    )

    const getStyle = useCallback(
      (selectors: string[]): NodeStyle => {
        const reversedSelectors = [...selectors].reverse()
        let style = Defaults.styles[reversedSelectors[0]] || {}
        if (styles) {
          for (let i = 0, selector; (selector = reversedSelectors[i]); i++) {
            if (styles[selector]) {
              style = { ...style, ...styles[selector] }
            }
          }
        }
        return style
      },
      [styles]
    )

    const handleLinkPress = useCallback(
      async (url?: string) => {
        if (!url) {
          return
        }
        if (onLinkPress) {
          onLinkPress(url)
        } else {
          try {
            await Linking.openURL(url)
          } catch (err) {
            if (onError) {
              onError(err)
            }
          }
        }
      },
      [onLinkPress, onError]
    )

    const renderNode = useCallback(
      (node: Node): ReactNode => {
        let style = getStyle(node.selectors)
        if (node.children && node.children.some((child) => child.name !== 'TextNode')) {
          style = { ...style, ...Defaults.styles.TextWrap }
        }
        const props: ElementProps = { attributes: node.attributes, handleLinkPress, passProps }
        const renderer = getRenderer(node.selectors)
        if (renderer) {
          return renderer(node, renderNodes, style, props)
        }
        return null
      },
      [getRenderer, getStyle, passProps, handleLinkPress]
    )

    const renderNodes = useCallback(
      (nodes?: Node[] | null) => <Fragment>{nodes?.map((n) => renderNode(n))}</Fragment>,
      [renderNode]
    )

    const handleHtmlParse = useCallback(
      (err, parsed: Node[]) => {
        if (err && onError) {
          onError(err)
        }
        setParsedHtml(parsed)
      },
      [onError]
    )

    const renderedHtml = useMemo(() => parsedHtml && renderNodes(parsedHtml), [parsedHtml, renderNodes])

    useEffect(() => {
      htmlToElement(html, handleHtmlParse, parserOptions)
    }, [html, handleHtmlParse, parserOptions])

    return <Fragment>{renderedHtml}</Fragment>
  }
)

HTMLRenderer.displayName = 'HTMLRenderer'

export default HTMLRenderer
