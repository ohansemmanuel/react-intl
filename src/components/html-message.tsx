/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

import * as React from 'react';
import {PrimitiveType} from 'intl-messageformat';
import FormattedMessage from './message';
import {Context} from './injectIntl';
import {invariantIntlContext} from '../utils';

class FormattedHTMLMessage extends FormattedMessage<
  Record<string, PrimitiveType>
> {
  static displayName = 'FormattedHTMLMessage';
  static defaultProps = {
    ...FormattedMessage.defaultProps,
    tagName: 'span' as 'span',
  };
  render() {
    return (
      <Context.Consumer>
        {intl => {
          if (!this.props.defaultMessage) {
            invariantIntlContext(intl);
          }

          const {formatHTMLMessage, textComponent: Text} = intl;
          const {
            id,
            description,
            defaultMessage,
            values: rawValues,
            // This is bc of TS3.3 doesn't recognize `defaultProps`
            tagName: Component = Text || 'span',
            children,
          } = this.props;

          let descriptor = {id, description, defaultMessage};
          let formattedHTMLMessage = formatHTMLMessage(descriptor, rawValues);

          if (typeof children === 'function') {
            return children(formattedHTMLMessage);
          }

          // Since the message presumably has HTML in it, we need to set
          // `innerHTML` in order for it to be rendered and not escaped by React.
          // To be safe, all string prop values were escaped when formatting the
          // message. It is assumed that the message is not UGC, and came from the
          // developer making it more like a template.
          //
          // Note: There's a perf impact of using this component since there's no
          // way for React to do its virtual DOM diffing.
          const html = {__html: formattedHTMLMessage};
          return <Component dangerouslySetInnerHTML={html} />;
        }}
      </Context.Consumer>
    );
  }
}

export default FormattedHTMLMessage;
