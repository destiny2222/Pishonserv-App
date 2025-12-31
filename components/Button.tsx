import { Pressable } from 'react-native'

function Button({ style, ...props }) {

  return (
    <Pressable 
      style={style} 
      {...props}
    />
  )
}
// const styles = StyleSheet.create({
//   btn: {
//     backgroundColor: Colors.primary,
//     padding: 18,
//     borderRadius: 6,
//     marginVertical: 10
//   },
//   pressed: {
//     opacity: 0.5
//   },
// })

export default Button